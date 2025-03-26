'use server'
import { randomBytes } from 'crypto';
import sendEmail from './sendEmail';
import { GetUserInfoByEmail, UpdateUsersToken } from '@/lib/db';
import { addMinutes } from 'date-fns';


export async function resetPassword(state: { message: string; status: number; error?: undefined; } | { error: string; status: number; message?: undefined; } | { error: string; } | null, formData : FormData){
  let email = '';
  const tmp = formData.get('email')?.toString();
  if (tmp === '')
    return { error : 'Email is empty. Please enter your email.', status : 0};

  if(tmp != undefined)
    email = tmp;
  else
    throw new Error('Email is undefined, check resetPassword/index.ts & forgotPassword/page.tsx');
  
  
  const res = await GetUserInfoByEmail({email});
  let user = (res != undefined && await res.json());


  
  if(user.length === 0)
    return {error: 'There is no user with that Email, please enter your correct email', status: 0};

  if(user.length === 1)
    user = user[0];

  const token = randomBytes(32).toString('base64url');
  const now = addMinutes(new Date(), 15);
  const retValUpdateUserToken = await UpdateUsersToken(user.id, token, now);
  
  const retValEmail = await sendEmail(email, token, user.id);

  if(retValEmail.status != 200 || retValUpdateUserToken?.status != 200)
    throw new Error('Something is wrong check resetPassword/index.ts')

  return {error: '', status: 200};
}