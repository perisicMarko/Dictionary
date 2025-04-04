import { NextRequest, NextResponse } from 'next/server';
import { setAsLearned } from '@/actions/manageNotes';
import { decryptRefresh, encryptAccess, verifySession,  } from '@/actions/manageSession';
import { TokenPayload } from '@/actions/manageSession';
import { cookies } from 'next/headers';
import { STATUS } from '@/actions/manageSession';

export async function POST(req : NextRequest){

    if (req.method !== 'POST') return NextResponse.json({status: 405}); //server error

    const data = await req?.json();
    const retVal = await verifySession(data.accessToken);
    if(retVal === STATUS.UNAUTHORIZED){ //unauthorized
        const response = await fetch('/api/auth/logOut', {
            method: 'POST',
            credentials: 'include',
        });
        if(response.ok)
            return NextResponse.json({status: 401});
    }
    else if(retVal === STATUS.ACCESS_NEEDED){
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const {email, userId} = payload as TokenPayload;
        await setAsLearned(data.noteId, data.status);
        const accessToken = await encryptAccess({email, userId});

        return NextResponse.json({accessToken}, {status: 201});
    }else if(retVal === STATUS.VALID_ACCESS){        
        await setAsLearned(data.noteId, data.status);
        const token = data.accessToken;
        return NextResponse.json({token}, {status: 200}); 
    }

    return NextResponse.next;
}