"use server"
import { SignUpSchema, LogInSchema } from '@/lib/rules';
import { GetUserInfoByEmail, InsertUserInfo } from '@/lib/db';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { createSession } from '../lib/session';
import { cookies } from 'next/headers';
import { TUser } from '@/lib/types';
import { NextResponse } from 'next/server';


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
            error: ""
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
        const res = await GetUserInfoByEmail({email: (tmp ? tmp : '')});
        const alreadyExist = await (res != undefined && res.json());
        if(alreadyExist.length != 0 && validatedFields.success){
            const retObj = {
                errors: null,
                lastName: "", 
                name: "",
                email: "",
                error: 'Email already used.'
            } ;

        return retObj;
        }   
    }

    const {name, lastName, email} = validatedFields.data;
    let {password} = validatedFields.data;
    password = await bcrypt.hash(password, 10);

    const status = await InsertUserInfo({name, lastName, email, password});

    if(status){
        console.log('New User signed up!');
        redirect('/logIn');
    }
    else{
        redirect('/signUp');
    }
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
    const tmp : NextResponse | NextResponse<{ error: string; }> | undefined = await GetUserInfoByEmail({email});
    const tmp1 : TUser[] = (await (tmp!= undefined && tmp.json()));
    if(tmp1 && tmp1.length > 1)
        throw new Error("Result from database should be [] or only one user!, bad sign up logic.");

    if(tmp1.length === 0 || tmp1.length === undefined) return {errors: {email: '-Wrong email.', password: ''}}; 

    const user : TUser = tmp1[0];

    const cmpStatus = await bcrypt.compare(password, user?.password);
    if(!cmpStatus) 
        return {
            errors: {password: '-Wrong password.', email: ''},
            email: email
        };

    await createSession(user.id.toString());
    const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000)
    const cookieStore = await cookies();
   
    cookieStore.set('userId', user.id.toString(), {
      httpOnly: false, 
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });
    redirect('/user/' + user.id + '/inputWord');
}


export async function logOut(){
    const cookieStore = await cookies();
    cookieStore.delete('session');
    cookieStore.delete('userId');
    redirect('/');
}
