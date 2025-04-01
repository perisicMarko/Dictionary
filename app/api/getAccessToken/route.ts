import { encryptAccess, decryptRefresh } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(){
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if(!refreshToken){//unauthorized 
        console.log('GETACCESS API: Logging out due to undefined refresh token');
        const response = await fetch('/api/auth/logOut', {
            method: "POST",
            credentials: "include"
        });
        return response
    }

    const payload = await decryptRefresh(refreshToken || '');
    if(payload){
        const {email, userId} = payload;
        const accessToken = await encryptAccess({email, userId})
        return NextResponse.json({accessToken}, {status: 200});
    }
}