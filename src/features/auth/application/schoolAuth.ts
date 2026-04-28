
"use server"
import { LoginSchema, SchoolSignupSchema } from '@/shared/lib/rules';
import bcrypt from 'bcrypt';
import { findSchoolByEmail, findSchoolPartnershipByEmail, insertSchoolInfo } from '@/features/schools/infrastructure/repository';
import { createSession } from '@/server/auth/schoolSession';
import { cookies } from 'next/headers';

type loginResponseType = undefined
  | {
      success: boolean;
      errors: undefined;
      email: string;
    }
  | {
      success: boolean;
      errors: {
        email?: string[] | string;
        password?: string[] | string;
      };
      email: string;
    };


export async function authenticateLogin(state: loginResponseType, formData: FormData){
    const inputEmail = formData.get('email') || '';
    const inputPassword = formData.get('password') || '';

    const validatedFields = LoginSchema.safeParse({
        email: inputEmail,
        password: inputPassword,
    });

    if(!validatedFields.success){
        const retObj = {
            errors: validatedFields.error.flatten().fieldErrors,
            email: "",
            success: false,
        };

        if(!retObj.errors?.email)   
            retObj.email = inputEmail.toString();
    
        return retObj;
    }

    const {email, password} : {email: string, password: string} = validatedFields.data;
    const school = await findSchoolByEmail(email);
    
    if(!school) return {errors: {email: '-Wrong email.', password: ''}, email: '', success: false}; 

    const cmpStatus = await bcrypt.compare(password, school?.password || '');
    if(!cmpStatus) 
        return {
            errors: {password: '-Wrong password.', email: ''},
            email: email, 
            success: false,
        };
    
    await createSession(email, school.id);
    
    return {errors: undefined, email: '', success: true};
}


type signupResponseType = undefined
  | {
      success: boolean;
      errors: undefined;
      name: string;
      partner: boolean;
      email: string;
      error: string;
    }
  | {
      success: boolean;
      errors: {
        email?: string[] | string;
        password?: string[] | string;
        name?: string[] | string;
        confirmPassword?: string[] | string;
      };
      error: string;
      partner: boolean;
      email: string;
      name: string;
    };

export async function authenticateSignup(state: signupResponseType, formData: FormData){

    const validatedFields = SchoolSignupSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    });

    if(!validatedFields.success){
        const retObj = {
            errors: validatedFields.error.flatten().fieldErrors,
            name: "",
            email: "", 
            error: "",
            partner: true,
            success: false
        } ;
        

        const nameError = formData.get('name')?.toString();
        if(!retObj.errors?.name && nameError)
            retObj.name = nameError;
    
        const emailError = formData.get('email')?.toString();
        if(!retObj.errors?.email && emailError)
            retObj.email = emailError;

        return retObj;
    }else{
        const tmp = formData.get('email')?.toString();
        const res = await findSchoolByEmail(tmp || '');
        const alreadyExist = res != null;
        if(alreadyExist && validatedFields.success){
            const retObj = {
                errors: undefined,
                name: "",
                email: "",
                error: 'Email already used.',
                partner: true,
                success: false
            } ;

        return retObj;
        }   
    }
    
    const {name, email} = validatedFields.data;
    const partner = await findSchoolPartnershipByEmail(email);
    if(!partner || !partner.active_partnership)
        return {
            errors: undefined,
            name: "",
            email: "",
            error: '',
            partner: false,
            success: false
        } ;

    let {password} = validatedFields.data;
    password = await bcrypt.hash(password, 10);

    const status = await insertSchoolInfo(name.toLowerCase(), email, password);

    if(!status)
        throw new Error('Error: insertSchoolInfo status in authenticateSignup');

    
    return {
        errors: undefined,
        name: "",
        email: "",
        error: '',
        partner: true,
        success: true
    } ;
}


export async function logOut(){
    (await cookies()).delete("sessionToken");
    
    return {success: true};
}
