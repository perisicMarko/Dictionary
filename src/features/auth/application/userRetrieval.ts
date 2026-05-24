'use server'
import { decryptSession, SessionPayload } from "@/server/auth/schoolSession";
import { findAllUsersBySchoolId, findUserByAccountActionToken } from "@/features/auth/infrastructure/usersRepository";

export async function getUserByToken(token : Base64URLString){
    const user = await findUserByAccountActionToken(token);

    if(!user)
        return {success: false, data: null};

    return { success: true, data: user};
}

export async function getUsersBySchool(){
    const payloadRes = await decryptSession();

    if(!payloadRes.success){
        return {success: false}
    }

    const {schoolId} = payloadRes.data as SessionPayload;

    const users = await findAllUsersBySchoolId(schoolId);

    return {
        success: true,
        data: users?.map((u) => ({email: u.email, firstName: u.first_name, lastName: u.last_name, languages: u.languages, keyExpirationDate: u.subscriptions.key_expiration_date as Date}))
    }
}
