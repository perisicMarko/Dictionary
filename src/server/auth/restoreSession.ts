'use server';

import { findSubscriptionByEmail } from "@/features/schools/infrastructure/repository";
import { decryptRefresh, TokenPayload, encryptRefresh, encryptAccess } from "@/server/auth/session";
import { isBefore } from "date-fns";
import { cookies } from "next/headers";


export async function restoreSession(){

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const payload = await decryptRefresh(refreshToken || '');
  const {email, userId} = payload as TokenPayload;
  const subscription = await findSubscriptionByEmail(email);
  
  if(!subscription || isBefore(subscription.key_expiration_date as Date, new Date()) || !payload) //unauthorized
      return {success:false, status:401};
  
  const newRefreshToken = await encryptRefresh({email, userId});
  cookieStore.set('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 dana
  });

  const newAccessToken = await encryptAccess({email, userId});

  return {success: true, accessToken: newAccessToken, status: 200};
}
