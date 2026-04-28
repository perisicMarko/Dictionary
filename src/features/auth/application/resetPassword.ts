'use server'
import { randomBytes } from 'crypto';
import sendEmail from './sendResetPasswordEmail';
import { findUserByEmail, updateAccountActionTokenByUserId, updateUserPasswordById } from '@/features/auth/infrastructure/usersRepository';
import { addMinutes } from 'date-fns';

import bcrypt from 'bcrypt';


export async function requestPasswordReset(state: { success : boolean, errorMessage : string } | undefined, formData : FormData){
  const email = (formData.get('email') as FormDataEntryValue).toString();
  
  const user = await findUserByEmail(email);

  if(!user)
    return { success: false, errorMessage: 'There is no user using that Email, please enter your email' };

  const token = randomBytes(32).toString('base64url');
  const now = new Date();
  const accountActionTokenUpdated = await updateAccountActionTokenByUserId(user.id, token, addMinutes(now, 15));
  const retValEmail = await sendEmail(email, token);

  if(!retValEmail.success){
    return { success: false, errorMessage: retValEmail.errorMessage };
  } else if(!accountActionTokenUpdated){
    return { success: false, errorMessage: 'Something went wrong, please try again later.' };
  }

  return {success: true, errorMessage: ''};
}


function validateNewPassword(password : string, confirmPassword : string){
  const errors : {password: string[], confirmPassword: boolean} = {password: [], confirmPassword: true};

  if(password.length < 5)
    errors.password.push('Must be at least five characters long!');

  if(!(/[a-zA-Z]/.test(password)))
      errors.password.push('Must contain at least one character!');

  if(!(/[0-9]/.test(password)))
      errors.password.push('Must contain at least one number!');

  if(!(/[^a-zA-Z0-9]/.test(password)))
      errors.password.push('Must contain at least one special character!')

  if(password != confirmPassword)
      errors.confirmPassword = false;

  if(errors.password.length > 0 || errors.confirmPassword === false)
      return {errors: errors, success: false};
  
  return {errors: errors, success: true};
}


export async function completePasswordReset(state : { errors: { password: string[]; confirmPassword: boolean; }; success: boolean; } | undefined, formData : FormData){
  const pass = formData.get('password')?.toString().trim() as string;
  const confirmPass = formData.get('confirmPassword')?.toString().trim() as string;

  const res = validateNewPassword(pass, confirmPass);

  const password = await bcrypt.hash(pass, 10);
  const userId = Number(formData.get('userId'));
  await updateUserPasswordById(userId, password);
  await updateAccountActionTokenByUserId(userId, null, null);

  return res
}
