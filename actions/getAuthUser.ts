import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export default async function GetAuthUser(){
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if(session){
        return await decrypt(session);
    }
}