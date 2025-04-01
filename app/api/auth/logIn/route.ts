import { serialize } from 'cookie';
import { SignJWT } from "jose";
import { authenticateLogIn } from '@/actions/auth';
import { NextRequest, NextResponse } from 'next/server';
import { GetUserInfoByEmail } from '@/actions/manageUsers/db';

const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET);
// const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET);

export async function POST(req : NextRequest){

    if (req.method !== 'POST') return NextResponse.json({status: 405});

    const data = await req?.json();

    const retVal = await authenticateLogIn(data.email, data.password);

    if(!retVal.success)
        return NextResponse.json({errors: retVal.errors, email: retVal.email}, {status: 401});

    const user = await GetUserInfoByEmail(data.email);
    // proceeds to make tokens
    const refreshToken = await new SignJWT({email: data.email, userId: user?.id})
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10d")
    .sign(REFRESH_SECRET);

    // Set HTTP-only cookie for refresh token
    const res = NextResponse.json({status: 200});
    res.headers.set('Set-Cookie', serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,// devlop env
      //production env secure: true,
      path: '/',
      sameSite: 'strict',
    }));

    return res; 
}