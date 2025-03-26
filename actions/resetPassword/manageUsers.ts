'use server'
import { GetUserByToken, UpdateUsersPassword, UpdateUsersToken } from "@/lib/db"
import bcrypt from 'bcrypt';


export async function getUserByToken(token : Base64URLString){

    const retVal = await GetUserByToken(token);
    const user = (retVal != undefined && await retVal.json());

    if(user.length === 0)
        return false;
    
    return user[0];
}

function validateFields(password : string, confirmPassword : string){
    const errors : {password: string[], confirmPassword: boolean} = {password: [], confirmPassword: true};

    if(password === '' )
        errors.password.push('Not be empty.');
    
    if(!(/[a-zA-Z]/.test(password || '')))
        errors.password.push('Must contains at least one character!');

    if(!(/[0-9]/.test(password || '')))
        errors.password.push('Must contains at least one number!');

    if(!(/[^a-zA-Z0-9]/.test(password || '')))
        errors.password.push('Must contains at least one special character!')

    if(password != confirmPassword)
        errors.confirmPassword = false;

    if(errors.password.length > 0 || errors.confirmPassword === false)
        return {errors: errors, success: false};
    
    return {errors: errors, success: true};
}


export async function updateUsersPassword(state : { errors: { password: string[]; confirmPassword: boolean; }; success: boolean; } | { errors: undefined; success: boolean; } | undefined, formData : FormData){

    const pass = formData.get('password')?.toString().trim();
    const confirmPass = formData.get('confirmPassword')?.toString().trim();

    const validatedFields = validateFields(pass || '', confirmPass || '');

    
    if(!validatedFields.success)
        return validatedFields;

    const password = await bcrypt.hash(pass || '', 10);
    const userId = Number(formData.get('userId'));
    await UpdateUsersPassword(userId, password);
    await UpdateUsersToken(userId, null, null);


    return validatedFields
}