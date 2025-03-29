"use server"
import { SignUpSchema, LogInSchema } from '@/lib/rules';
import { GetUserByToken, GetUserInfoByEmail, InsertUserInfo, VerifyUser } from '@/actions/manageUsers/db';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { createSession } from '../../lib/session';
import { cookies } from 'next/headers';
import sendEmail, { generateVerificationMail } from './sendVerificationEmail';
import { isBefore } from 'date-fns';
import { decrypt } from '@/lib/session'



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
} | undefined | {error : string};

export async function verifyUser(state : { success: boolean; } | undefined, formData : FormData){
    const userId = Number(formData.get('userId'));
    if(!userId)
        throw new Error('User is undefined by verification, check auth/index/verifyUser');
    
    const status = await VerifyUser(userId);

    if(status)
        return {success: true};

    return {success: false};
}

export async function authenticateSignUp(state: stateType, formData: FormData){

    const validatedFields = SignUpSchema.safeParse({
        name: formData.get("name"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    });

    if(!validatedFields.success){
        const retObj = {
            errors: validatedFields.error.flatten().fieldErrors,
            name: "",
            lastName: "", 
            email: "", 
            error: "",
            success: false
        } ;
        

        const nameError = formData.get('name')?.toString();
        if(!retObj.errors?.name && nameError)
            retObj.name = nameError;
    
        const lastNameError = formData.get('lastName')?.toString();
        if(!retObj.errors?.lastName && lastNameError)
            retObj.lastName = lastNameError;
    
        const emailError = formData.get('email')?.toString();
        if(!retObj.errors?.email && emailError)
            retObj.email = emailError;

        return retObj;
    }else{
        const tmp = formData.get('email')?.toString();
        const res = await GetUserInfoByEmail({email: tmp || ''});
        const alreadyExist = res != null;
        if(alreadyExist && validatedFields.success){
            const retObj = {
                errors: null,
                lastName: "", 
                name: "",
                email: "",
                error: 'Email already used.',
                success: false
            } ;

        return retObj;
        }   
    }


    const {name, lastName, email} = validatedFields.data;
    let {password} = validatedFields.data;
    password = await bcrypt.hash(password, 10);

    const status = await InsertUserInfo({name, lastName, email, password});

    if(!status)
        throw new Error('Error: InsertUserInfor status in authenthicateSignUp');

    const verified = await generateVerificationMail(email);

    if(verified)
        return {
            errors: null,
            lastName: "", 
            name: "",
            email: "",
            error: '',
            success: true
        } ;
}

export async function resendVerificationMail(state : boolean | undefined, formData : FormData){
    const email = formData.get('email')?.toString() || '';
    if(email === '')
        return false;
    const user = await GetUserInfoByEmail({email});
    
    if(!user)
        return;
    
    if(isBefore(user?.refresh_token_expiration_date || '', new Date()))
        return false;

    const status = await sendEmail(email, user?.refresh_token || '');

    if(status)
        return true;
}   

export async function getUserByToken(token : Base64URLString){

    const user = await GetUserByToken(token);
    
    if(!user)
        return false

    return user;
}  

export async function authenticateLogIn(state : stateType, formData : FormData){
    const validatedFields = LogInSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if(!validatedFields.success){
        const retObj = {
            errors: validatedFields.error.flatten().fieldErrors,
            email: ""
        };

        const emailError = formData.get('email')?.toString();
        if(!retObj.errors?.email && emailError)   
            retObj.email = emailError;
    
        return retObj;
    }

    const {email, password} : {email: string, password: string} = validatedFields.data;
    const user = await GetUserInfoByEmail({email});
    
    if(!user) return {errors: {email: '-Wrong email.', password: ''}}; 

    const cmpStatus = await bcrypt.compare(password, user?.password);
    if(!cmpStatus) 
        return {
            errors: {password: '-Wrong password.', email: ''},
            email: email
        };

    await createSession(user.id.toString(), user.password);
    
    redirect('/dictionary/inputWord');
}


export async function logOut(){
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/');
}

export async function getAuthUser(){
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if(session){
        return await decrypt(session);
    }
}