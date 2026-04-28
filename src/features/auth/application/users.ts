'use server'
import { decryptSession } from "@/server/auth/session";
import { findAllUsersBySchoolId, findUserByToken } from "@/features/auth/infrastructure/usersRepository";

export async function getUserByToken(token : Base64URLString){
    const user = await findUserByToken(token);

    if(!user)
        return undefined;
    return user;
}

export async function getUsersBySchool(){
    const payload = await decryptSession();

    if(!payload){ // 401
        return;
    }

    const {schoolId} = payload;

    const users = await findAllUsersBySchoolId(schoolId);

    return users?.map((u) => ({email: u.email, firstName: u.first_name, lastName: u.last_name, languages: u.languages, keyExpirationDate: u.subscriptions.key_expiration_date as Date}));
}
