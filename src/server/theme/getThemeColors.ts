'use server';
import { cookies } from 'next/headers';
import { decryptRefresh, TokenPayload } from '@/server/auth/userSession';
import { decryptSession, SessionPayload } from '@/server/auth/schoolSession';
import { getThemeColors as getThemeColorsByUserId } from '@/server/theme/repository';
import { findSchoolByEmail } from '@/features/schools/infrastructure/repository';


const DEFAULT_THEME_COLORS = {
  "main": "222 25% 8%",
  "second": "222 30% 20%",
  "text_main": "0 0% 96%",
  "text_second": "210 15% 56%"
};

export default async function getThemeColors(){
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const sessionPayload = await decryptSession();

    if(!sessionPayload && !refreshToken){ // returns style if not tokens are created, home page, log in page ...
        return DEFAULT_THEME_COLORS;
    }

    if(sessionPayload){ //returns style if school is logged in, no need to test everything cause no user will ever has school token in his browser
        const {email} = sessionPayload as SessionPayload;
        const school = await findSchoolByEmail(email);

        if(school)        
            return school.colors;
    }

    const refreshPayload = await decryptRefresh(refreshToken || '');
    if(!refreshPayload)
        return DEFAULT_THEME_COLORS;
    
    const {userId} = refreshPayload as TokenPayload;

    if(!userId)
        return DEFAULT_THEME_COLORS;
     

    const user = await getThemeColorsByUserId(userId);

    if(!user?.schools?.colors) // returns default style when user's school does not have custom theme colors
            return DEFAULT_THEME_COLORS;
    
    // returns colors of the logged user's school
    return user?.schools?.colors;
}
