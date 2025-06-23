'use server';
import { cookies } from 'next/headers';
import { decryptRefresh, TokenPayload } from '../manageSession';
import { GetThemeColors } from './db';


const DEFAULT_THEME_COLORS = {
    main: '222 33% 17%',
    second: '217 92% 67%'
}

export default async function getThemeColors(){
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if(!refreshToken)
        return DEFAULT_THEME_COLORS;
    const payload = await decryptRefresh(refreshToken || '');
    const {userId} = payload as TokenPayload;

    if(!userId){
        throw new Error('There is no valid token, getting theme color error');
    }

    const user = await GetThemeColors(userId);

    if(!user?.schools?.colors)
        return DEFAULT_THEME_COLORS;
    
    //else
    return user?.schools?.colors;
}