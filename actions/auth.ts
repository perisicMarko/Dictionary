/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import { SignUpSchema, LogInSchema } from '@/lib/rules';
import { GetUserInfo, InsertUserInfo } from '@/lib/db';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { createSession } from '../lib/session';
import { cookies } from 'next/headers';


export async function authenticateSignUp(state: any, formData: any){

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
            email: ""
        };

        if(!retObj.errors?.name)
            retObj.name = formData.get('name');
    
        if(!retObj.errors?.lastName)
            retObj.lastName = formData.get('lastName');
    
        if(!retObj.errors?.email)
            retObj.email = formData.get('email');

        return retObj;
    }

    const {name, lastName, email} = validatedFields.data;
    let {password} = validatedFields.data;
    password = await bcrypt.hash(password, 10);

    const status = await InsertUserInfo({name, lastName, email, password});

    if(status){
        console.log('New User signed up!');
        redirect('/logIn');}
    else{
        redirect('/signUp');
    }
}

export async function authenticateLogIn(state: any, formData : any){
    const validatedFields = LogInSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if(!validatedFields.success){
        const retObj = {
            errors: validatedFields.error.flatten().fieldErrors,
            email: ""
        };

        if(!retObj.errors?.email)   
            retObj.email = formData.get('email');
    
        return retObj;
    }

    const {email, password} : {email: string, password: string} = validatedFields.data;
    const tmp : any = await GetUserInfo({email});
    let user = (await tmp.json()); // retrieve the first and only row
    
    if(user && user.length > 1)
        throw new Error("Result from database should be [] or only one user!, bad sign up logic.");

    if(user.length === 0 || user.length === undefined) return {errors: {password: 'Wrong email.'}}; 

    user = user[0];

    const cmpStatus = await bcrypt.compare(password, user?.password);
    if(!cmpStatus) 
        return {
            errors: {password: 'Wrong password.'},
            email: email
        };

    await createSession(user.id);

    redirect('/user');
}


export async function logOut(){
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/');
}
