"use server"
import { SignUpSchema, LogInSchema } from '@/lib/rules';
import { ChangeUsersSchool, GetUserByToken, GetUserInfoByEmail, InsertUserInfo, VerifyUser } from '@/actions/manageUsers/db';
import bcrypt from 'bcrypt';
import sendEmail, { generateVerificationMail } from './sendVerificationEmail';
import { isBefore } from 'date-fns';
import { encryptRefresh } from '@/actions/manageSession';
import { cookies } from 'next/headers';
import { CreateActivationKey, GetSubscription } from '@/actions/manageSchools/db';

type SignUpFieldErrors = Partial<Record<'name' | 'lastName' | 'email' | 'password' | 'confirmPassword', string[]>>;

// Primer tipa za useActionState na front-u: state je isti oblik kao povratna vrednost action-a.
export type SignUpActionState =
    | {
        errors: SignUpFieldErrors;
        name: string;
        lastName: string;
        email: string;
        error: string;
        subscription: string;
        success: boolean;
    }
    | {
        errors: null;
        name: string;
        lastName: string;
        email: string;
        error: string;
        subscription: string;
        success: boolean;
    }
    | undefined;

export async function verifyUser(userId: number) {
    if (!userId)
        throw new Error('User is undefined by verification, check auth/index/verifyUser');

    const status = await VerifyUser(userId);

    if (status)
        return { success: true };

    return { success: false };
}

export async function authenticateSignUp(state: SignUpActionState, formData: FormData) {

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

    // this is subscription logic, only someone with subscription can create account
    // while app is free to use, this segment should be commented out, in production it should be uncommented
    //const subscription = await GetSubscription(email);
    // this segment should be commented while app is free to use
    // if (!subscription)
    //     return {
    //         errors: null,
    //         lastName: "",
    //         name: "",
    //         email: "",
    //         error: '',
    //         subscription: 'Sorry, there is no valid subscription for this email address.',
    //         success: false
    //     };

    // if (isBefore(subscription.key_expiration_date as Date, new Date()))
    //     return {
    //         errors: null,
    //         lastName: "",
    //         name: "",
    //         email: "",
    //         error: '',
    //         subscription: 'Sorry, there is no valid subscription for this email address.',
    //         success: false
    //     };


    let { password } = validatedFields.data;
    password = await bcrypt.hash(password, 10);

    // if (!subscription.school_id)
    //     throw new Error('School id is null in subsription retrieval.');

    // this fails because if no subscription exists it would cause f key violation, but since subscription logic is commented out for free to use app
    // subscription is mocked with next line
    const mock_subscription = await CreateActivationKey(email, new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), 1);


    // hardcoded 1, in production with school program subscription.school_id should always be valid and not null
    const status = await InsertUserInfo(name, lastName, email, password, 1); 

    // subscription commented logic, uncomment in school program production
    //const status = await InsertUserInfo(name, lastName, email, password, subscription.school_id); 
    


    // this breaks program
    if (!status)
        throw new Error('Error: InsertUserInfo status in authenthicateSignUp');

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

export type ResendVerificationState = boolean | undefined;

export async function resendVerificationMail(state: ResendVerificationState, formData: FormData) {
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

export type LogInActionState = {
    error: { message: string } | undefined;
    status: number;
} | undefined;

const logInStatus = {
    SUCCESS: 0,
    UNVERIFIED: 1,
    WRONG_CREDENTIALS: 2,
    INVALID_SUBSCRIPTION: 3
};

export async function authenticateLogIn(state: LogInActionState, formData: FormData) {

    const inputEmail = formData.get('email')?.toString() as string;
    const inputPassword = formData.get('password')?.toString() as string;

    const validatedFields = LogInSchema.safeParse({
        email: inputEmail,
        password: inputPassword,
    });

    if (!validatedFields.success) {
        return { error : {message : "Wrong email or password."}, status: logInStatus.WRONG_CREDENTIALS };;
    } else {
        const { email, password } = validatedFields.data as { email: string, password: string };
        const user = await GetUserInfoByEmail(email);

        if (!user) return { error : {message : "Wrong email or password."}, status: logInStatus.WRONG_CREDENTIALS };

        // UNCOMMENT IN PRODUCTION
        //const subscription = await GetSubscription(email);
        // if (!subscription)
        //     return {
        //         error: undefined,
        //         status: logInStatus.INVALID_SUBSCRIPTION
        //     };

        // if (isBefore(subscription.key_expiration_date as Date, new Date()))
        //     return {
        //         error: undefined,
        //         status: logInStatus.INVALID_SUBSCRIPTION
        //     };


        const cmpStatus = await bcrypt.compare(password, user?.password);
        if (!cmpStatus)
            return {
                error: {message: "Wrong email or password."},
                status: logInStatus.WRONG_CREDENTIALS
            };

        if (!user.email_verified)
            return {
                error: undefined,
                status: logInStatus.UNVERIFIED
            };


        // should be uncommented in production
        // if (!subscription.school_id)
        //     throw new Error('School id is null in subsription retrieval.');

        // if (user.school_id != subscription.school_id) {
        //     await ChangeUsersSchool(user.id, subscription.school_id);
        // }

        const refreshToken = await encryptRefresh({ email: user.email, userId: user.id })

            //iz nekog razloga mi je trazio await ne znam zasto
            ; (await cookies()).set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                path: '/',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });

        return { error: undefined, status: logInStatus.SUCCESS };
    }
}


export async function logOutUser() {
    (await cookies()).delete("refreshToken");


    return { success: true };
}
