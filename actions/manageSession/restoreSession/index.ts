'use server';

import { decryptRefresh, TokenPayload, encryptRefresh } from "@/actions/manageSession";
import { cookies } from "next/headers";


export async function restoreSession(){
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const payload = await decryptRefresh(refreshToken || '');
    const {email, userId} = payload as TokenPayload;
  
    const newRefreshToken = await encryptRefresh({email, userId});
    cookieStore.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dana
    });
  }