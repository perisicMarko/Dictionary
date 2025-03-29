'use server'
import { GetUserByToken } from "./db";


export async function getUserByToken(token : Base64URLString){
    const user = await GetUserByToken(token);

    if(!user)
        return undefined;
    return user;
}
