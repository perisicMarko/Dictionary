"use server"
import { SignUpSchema, LogInSchema } from '@/lib/rules';
import { ChangeUsersSchool, GetUserByToken, GetUserInfoByEmail, InsertUserInfo, VerifyUser } from '@/actions/manageUsers/db';
import bcrypt from 'bcrypt';
import sendEmail, { generateVerificationMail } from './sendVerificationEmail';
import { isBefore } from 'date-fns';
import { encryptRefresh } from '@/actions/manageSession';
import { cookies } from 'next/headers';
import { GetSubscription } from '@/actions/manageSchools/db';

type stateType = {
    errors: {
        email?: string[] | undefined;
        password?: string[] | undefined;
    };
    email: string;
} | {
    errors: {
        password: string;
    };
    email?: undefined;
} | {
    errors: {
        password: string;
    };
    email: string;
    subscription: string;
} | undefined | { error: string };

export async function verifyUser(userId: number) {
    if (!userId)
        throw new Error('User is undefined by verification, check auth/index/verifyUser');

    const status = await VerifyUser(userId);

    if (status)
        return { success: true };

    return { success: false };
}

export async function authenticateSignUp(state: stateType, formData: FormData) {

    const validatedFields = SignUpSchema.safeParse({
        name: formData.get("name"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    });

    if (!validatedFields.success) {
        const retObj = {
            errors: validatedFields.error.flatten().fieldErrors,
            name: "",
            lastName: "",
            email: "",
            error: "",
            subscription: '',
            success: false,
        };

        const nameError = formData.get('name')?.toString();
        if (!retObj.errors?.name && nameError)
            retObj.name = nameError;

        const lastNameError = formData.get('lastName')?.toString();
        if (!retObj.errors?.lastName && lastNameError)
            retObj.lastName = lastNameError;

        const emailError = formData.get('email')?.toString();
        if (!retObj.errors?.email && emailError)
            retObj.email = emailError;

        return retObj;
    } else {
        const tmp = formData.get('email')?.toString() as string;
        const res = await GetUserInfoByEmail(tmp);
        const alreadyExist = res != null;
        if (alreadyExist && validatedFields.success) {
            const retObj = {
                errors: null,
                lastName: "",
                name: "",
                email: "",
                error: 'Email already used.',
                subscription: '',
                success: false
            };

            return retObj;
        }
    }


    const { name, lastName, email } = validatedFields.data;
    const subscription = await GetSubscription(email);
    if (!subscription)
        return {
            errors: null,
            lastName: "",
            name: "",
            email: "",
            error: '',
            subscription: 'Sorry, there is no valid subscription for this email address.',
            success: false
        };

    if (isBefore(subscription.key_expiration_date as Date, new Date()))
        return {
            errors: null,
            lastName: "",
            name: "",
            email: "",
            error: '',
            subscription: 'Sorry, there is no valid subscription for this email address.',
            success: false
        };


    let { password } = validatedFields.data;
    password = await bcrypt.hash(password, 10);

    if (!subscription.school_id)
        throw new Error('School id is null in subsription retrieval.');

    const status = await InsertUserInfo(name, lastName, email, password, subscription.school_id);

    if (!status)
        throw new Error('Error: InsertUserInfor status in authenthicateSignUp');

    const verified = await generateVerificationMail(email);
    if (verified)
        return {
            errors: null,
            lastName: "",
            name: "",
            email: "",
            error: '',
            subscription: '',
            success: true
        };
}

export async function resendVerificationMail(state: boolean | undefined, formData: FormData) {
    const email = formData.get('email')?.toString() || '';
    if (email === '')
        return false;
    const user = await GetUserInfoByEmail(email);

    if (!user)
        return;

    if (isBefore(user?.refresh_token_expiration_date || '', new Date()))
        return false;

    const status = await sendEmail(email, user?.refresh_token || '');

    if (status)
        return true;
}

export async function getUserByToken(token: Base64URLString) {

    const user = await GetUserByToken(token);

    if (!user)
        return undefined;

    return user;
}

type logInStateType = {
    errors: { email?: string[] | string | undefined; password?: string[] | string | undefined } | undefined,
    email: string,
    status: number,
} | undefined;

const logInStatus = {
    SUCCESS: 0,
    UNVERIFIED: 1,
    WRONG_CREDENTIALS: 2,
    INVALID_SUBSCRIPTION: 3
};

export async function authenticateLogIn(state: logInStateType, formData: FormData) {

    const inputEmail = formData.get('email')?.toString() as string;
    const inputPassword = formData.get('password')?.toString() as string;

    const validatedFields = LogInSchema.safeParse({
        email: inputEmail,
        password: inputPassword,
    });

    const retObj: logInStateType = {
        errors: undefined,
        email: '',
        status: -1
    };

    if (!validatedFields.success) {
        retObj.errors = validatedFields.error.flatten().fieldErrors
        if (!retObj.errors.email)
            retObj.email = inputEmail;

        return retObj;

    } else {
        const { email, password } = validatedFields.data as { email: string, password: string };
        const user = await GetUserInfoByEmail(email);

        if (!user) return { errors: { email: '-Wrong email.', password: '' }, email: '', status: logInStatus.WRONG_CREDENTIALS };

        const subscription = await GetSubscription(email);
        if (!subscription)
            return {
                errors: undefined,
                email: "",
                status: logInStatus.INVALID_SUBSCRIPTION
            };

        if (isBefore(subscription.key_expiration_date as Date, new Date()))
            return {
                errors: undefined,
                email: "",
                status: logInStatus.INVALID_SUBSCRIPTION
            };


        const cmpStatus = await bcrypt.compare(password, user?.password);
        if (!cmpStatus)
            return {
                errors: { password: '-Wrong password.', email: '' },
                email: email,
                status: logInStatus.WRONG_CREDENTIALS
            };

        if (!user.email_verified)
            return {
                errors: undefined,
                email: "",
                status: logInStatus.UNVERIFIED
            };

        if (!subscription.school_id)
            throw new Error('School id is null in subsription retrieval.');

        if (user.school_id != subscription.school_id) {
            await ChangeUsersSchool(user.id, subscription.school_id);
        }

        const refreshToken = await encryptRefresh({ email: user.email, userId: user.id })

            //iz nekog razloga mi je trazio await ne znam zasto
            ; (await cookies()).set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 dana
            });

        return { errors: undefined, email: '', status: logInStatus.SUCCESS };
    }
}


export async function logOutUser() {
    (await cookies()).delete("refreshToken");


    return { success: true };
}
