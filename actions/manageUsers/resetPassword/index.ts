'use server'
import { randomBytes } from 'crypto';
import sendEmail from '../sendEmail';
import { GetUserInfoByEmail, UpdateUsersRefreshToken, UpdateUsersPassword } from '@/actions/manageUsers/db';
import { addMinutes } from 'date-fns';

import bcrypt from 'bcrypt';


export async function resetPassword(state: { message: string; status: number; error?: undefined; } | { error: string; status: number; message?: undefined; } | { error: string; } | null, formData : FormData){
  let email = '';
  const tmp = formData.get('email')?.toString();
  if (tmp === '')
    return { error : 'Email is empty. Please enter your email.', status : 0};

  if(tmp != undefined)
    email = tmp;
  else
    throw new Error('Email is undefined, check resetPassword/index.ts & forgotPassword/page.tsx');
  
  
  const user = await GetUserInfoByEmail(email);
   
  if(!user)
    return {error: 'There is no user using that Email, please enter your email', status: 0};

  const token = randomBytes(32).toString('base64url');
  const now = addMinutes(new Date(), 15);
  const retValUpdateUserToken = await UpdateUsersRefreshToken(user.id, token, now);
  
  const retValEmail = await sendEmail(email, token, user.id);

  if(retValEmail.status != 200 || !retValUpdateUserToken)
    throw new Error('Something is wrong check resetPassword/index.ts')

  return {error: '', status: 200};
}



function validateFields(password : string, confirmPassword : string){
  const errors : {password: string[], confirmPassword: boolean} = {password: [], confirmPassword: true};

  if(password.length < 5)
    errors.password.push('Must be at least five characters long!');

  if(!(/[a-zA-Z]/.test(password || '')))
      errors.password.push('Must contain at least one character!');

  if(!(/[0-9]/.test(password || '')))
      errors.password.push('Must contain at least one number!');

  if(!(/[^a-zA-Z0-9]/.test(password || '')))
      errors.password.push('Must contain at least one special character!')

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
  await UpdateUsersRefreshToken(userId, null, null);


  return validatedFields
}