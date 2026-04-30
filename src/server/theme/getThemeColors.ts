'use server';
import { decryptSession, SessionPayload } from '@/server/auth/schoolSession';
import { getThemeColors as getThemeColorsByUserId } from '@/server/theme/repository';
import { findSchoolByEmail } from '@/features/schools/infrastructure/repository';
import { readAuthenticatedUser } from '@/server/auth/userSession';


const DEFAULT_THEME_COLORS = {
    "main": "222 25% 8%",
    "second": "222 30% 20%",
    "text_main": "0 0% 96%",
    "text_second": "210 15% 56%"
};

export default async function getThemeColors() {
    const requireRes = await readAuthenticatedUser();
    if (!requireRes) {
        return { success: false, data: DEFAULT_THEME_COLORS };
    }

    const {email, userId} = requireRes;
    const user = await getThemeColorsByUserId(userId);
    
    // if some school does not specify their colors, therefore this field might be null in database
    if(!user || user?.schools.colors){
        return {success: false, data: DEFAULT_THEME_COLORS};
    }


    return {success : true, data: user.schools.colors};
}


export async function getSchoolPlatformThemeColors(){
    const payloadRes = await decryptSession();

    if (!payloadRes.success) {
        return { success: false, data: DEFAULT_THEME_COLORS };
    }

    const { email } = payloadRes.data as SessionPayload;
    const school = await findSchoolByEmail(email);

    if (school){
        if(school.colors) // if some school does not specify their colors, therefore this field might be null in database
            return { success: true, data: school.colors };
    }
    
    return { success: false, data: DEFAULT_THEME_COLORS };
}