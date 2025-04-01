/* eslint-disable @typescript-eslint/no-unused-vars */
import { decryptRefresh } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET);

export async function POST(req : NextRequest){
    const cookies = req.cookies;
    const refreshToken = cookies.get('refreshToken')?.value;
    
    if(refreshToken === undefined) 
        return NextResponse.json({message: 'Token not found.'}, {status: 404});

    try{
        const payload = await decryptRefresh(refreshToken || '');
        if(payload){
            //skip to code after try catch
        }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(error : any){
        return NextResponse.json({message: 'Token deleted before log out was completed.'}, {status : 505});
    }

    const res = NextResponse.json({status: 200});
    res.headers.set('Set-Cookie', `refreshToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`); // add secure fore production 

    return res; 
}