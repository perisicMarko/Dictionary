import { logOutUser } from "@/actions/auth/user";
import { encryptAccess, decryptRefresh } from "@/actions/manageSession";
import { addMinutes, isBefore } from "date-fns";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(){
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if(!refreshToken){//unauthorized 
        console.log('GETACCESSTOKEN API: REFRESH TOKEN NOT AVALIABLE, NO ACCESS TOKEN RETURNED');
        await logOutUser();
        return NextResponse.json({status: 401});
    }

    const payload = await decryptRefresh(refreshToken || '');
    const expirationTime = new Date((payload?.exp || 0) * 1000);
    const nowPlus15 = addMinutes(new Date(), 1  );
    
    if(payload){
        const {email, userId} = payload;
        const accessToken = await encryptAccess({email, userId});
        if(isBefore(expirationTime, nowPlus15))
            return NextResponse.json({accessToken: accessToken, sessionExpiring: true}, {status: 200});
        else    
            return NextResponse.json({accessToken: accessToken, setExpiring: false}, {status: 200});
    }

    return NextResponse.json({status: 401});
}