"use server"

import { SignUpSchema, LogInSchema } from '@/lib/rules';


export async function authenticateSignUp(state, formData){

    const validatedFields = SignUpSchema.safeParse({
        name: formData.get("name"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    });

    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }
}

export async function authenticateLogIn(state, formData){
    const validatedFields = LogInSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }
}