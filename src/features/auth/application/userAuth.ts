"use server"
import { SignUpSchema, LogInSchema } from '@/lib/rules';
import { ChangeUsersSchool, findUserByToken, GetUserInfoByEmail, InsertUserInfo, isUserVerifiedById } from '@/features/auth/infrastructure/usersRepository';
import bcrypt from 'bcrypt';
import sendEmail, { generateVerificationMail } from './sendVerificationEmail';
import { isBefore } from 'date-fns';
import { encryptAccess, encryptRefresh } from '@/server/auth/session';
import { cookies } from 'next/headers';
import { CreateActivationKey, GetSubscription } from '@/features/schools/infrastructure/repository';
import { LogInStatus, LoginStatus } from '@/shared/auth/loginStatus';
import { redirect } from 'next/dist/server/api-utils';

type SignUpFieldErrors = Partial<Record<'name' | 'lastName' | 'email' | 'password' | 'confirmPassword', string[]>>;


export type SignUpActionState = {
        errors: SignUpFieldErrors | null;
        name: string;
        lastName: string;
        email: string;
        errorMessage: string;
        subscriptionStatusMessage: string;
        success: boolean;
    };

export async function isUserVerified(userId: number) {
    const status = await isUserVerifiedById(userId);

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
        const res = {
            errors: validatedFields.error.flatten().fieldErrors,
            name: "",
            lastName: "",
            email: "",
            errorMessage: "",
            subscriptionStatusMessage: '',
            success: false,
        };

        const nameError = (formData.get('name') as FormDataEntryValue).toString();
        if (!res.errors.name && nameError)
            res.name = nameError;

        const lastNameError = (formData.get('lastName') as FormDataEntryValue).toString();
        if (!res.errors.lastName && lastNameError)
            res.lastName = lastNameError;

        const emailError = (formData.get('email') as FormDataEntryValue).toString();
        if (!res.errors.email && emailError)
            res.email = emailError;

        return res;
    } 

    const user = await GetUserInfoByEmail((formData.get('email') as FormDataEntryValue).toString() as string);
    const alreadyExist = user != null;
    if (alreadyExist && validatedFields.success) {
        const retObj = {
            errors: null,
            lastName: "",
            name: "",
            email: "",
            errorMessage: 'User with this email already exists.',
            subscriptionStatusMessage: '',
            success: false
        };

        return retObj;
    }

    const { name, lastName, email } = validatedFields.data;

    // this is subscription logic, only someone with subscription can create account
    // while app is free to use, this segment should be commented out, in production it should be uncommented
    // const subscription = await GetSubscription(email);
    // this segment should be commented while app is free to use
    // if (!subscription)
    //     return {
    //         errors: null,
    //         lastName: "",
    //         name: "",
    //         email: "",
    //         errorMessage: '',
    //         subscriptionStatusMessage: 'Sorry, there is no valid subscription for this email address.',
    //         success: false
    //     };

    // if (isBefore(subscription.key_expiration_date as Date, new Date()))
    //     return {
    //         errors: null,
    //         lastName: "",
    //         name: "",
    //         email: "",
    //         errorMessage: '',
    //         subscriptionStatusMessage: 'Sorry, there is no valid subscription for this email address.',
    //         success: false
    //     };


    let { password } = validatedFields.data;
    password = await bcrypt.hash(password, 10);

    // if (!subscription.school_id)
    //     throw new Error('School id is null in subsription retrieval.');

    // this fails because if no subscription exists it would cause f key violation, but since subscription logic is commented out for free to use app
    // subscription is mocked with next line
    const oneYear = 1000 * 60 * 60 * 24 * 365;
    
    const mock_subscription = await CreateActivationKey(email, new Date(Date.now() + oneYear), 1);
    // hardcoded 1, in production with school program subscription.school_id should always be valid and not null
    const status = await InsertUserInfo(name, lastName, email, password, 1); 

    // subscription commented logic, uncomment in school program production
    //const status = await InsertUserInfo(name, lastName, email, password, subscription.school_id); 

    if (!status)
        throw new Error('Error: InsertUserInfo status in authenthicateSignUp');

    const emailGenerated = await generateVerificationMail(email);
    if (emailGenerated)
        return {
            errors: null,
            lastName: "",
            name: "",
            email: "",
            errorMessage: '',
            subscriptionStatusMessage: '',
            success: true
        };
}

export type ResendVerificationState = {success: boolean};

export async function resendVerificationMail(state: ResendVerificationState, formData: FormData) {
    const email = (formData.get('email') as FormDataEntryValue).toString();
    if (!email)
        return { success: false };

    const user = await GetUserInfoByEmail(email);

    if (!user)
        return { success: false };

    if (isBefore(user?.refresh_token_expiration_date || '', new Date()))
        return { success: false };

    const status = await sendEmail(email, user?.refresh_token || '');

    if (status)
        return { success: true };
}

export async function getUserByToken(token: Base64URLString) {

    const user = await findUserByToken(token);

    if (!user)
        return  { success: false, user: undefined };

    return  { success: true, user };
}

export type LogInActionState = {success: boolean, errorMessage: string, status: number};

export async function authenticateLogIn(state: LogInActionState, formData: FormData) {

    const inputEmail = (formData.get('email') as FormDataEntryValue).toString() as string;
    const inputPassword = (formData.get('password') as FormDataEntryValue).toString() as string;

    const validatedFields = LogInSchema.safeParse({
        email: inputEmail,
        password: inputPassword,
    });

    if (!validatedFields.success) {
        const status = LogInStatus.WRONG_CREDENTIALS;
        return { success: false, errorMessage: "Invalid email or password.", status: LogInStatus.WRONG_CREDENTIALS };
    } else {
        const { email, password } = validatedFields.data as { email: string, password: string };
        const user = await GetUserInfoByEmail(email);

        if (!user) return { success: false, errorMessage: "Invalid email or password.", status: LogInStatus.WRONG_CREDENTIALS };

        // UNCOMMENT IN PRODUCTION
        //const subscription = await GetSubscription(email);
        // if (!subscription)
        //     return {
        //         errorMessage: undefined,
        //         status: LogInStatus.INVALID_SUBSCRIPTION
        //     };

        // if (isBefore(subscription.key_expiration_date as Date, new Date()))
        //     return {
        //         errorMessage: undefined,
        //         status: LogInStatus.INVALID_SUBSCRIPTION
        //     };


        const cmpStatus = await bcrypt.compare(password, user?.password);
        if (!cmpStatus)
            return {
                success: false,
                errorMessage: "Invalid email or password.",
                status: LogInStatus.WRONG_CREDENTIALS
            };

        if (!user.email_verified)
            return {
                success: false,
                errorMessage: "Email not verified.",
                status: LogInStatus.UNVERIFIED
            };


        // should be uncommented in production
        // if (!subscription.school_id)
        //     throw new Error('School id is null in subsription retrieval.');

        // if (user.school_id != subscription.school_id) {
        //     await ChangeUsersSchool(user.id, subscription.school_id);
        // }

        const refreshToken = await encryptRefresh({ email: user.email, userId: user.id });
        const accessToken = await encryptAccess({ email: user.email, userId: user.id });

        //iz nekog razloga mi je trazio await ne znam zasto
        (await cookies()).set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        (await cookies()).set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 15 // 15 minutes
        });

        return { success: true, errorMessage: "All good.", status: LogInStatus.SUCCESS };
    }
}


export async function logOutUser() {
    (await cookies()).delete("refreshToken");
    (await cookies()).delete("accessToken");

    return { success: true };
}
