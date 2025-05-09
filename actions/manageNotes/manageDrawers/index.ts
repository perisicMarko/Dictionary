'use server'
import { decryptRefresh, encryptAccess, TokenPayload, verifySession } from "@/actions/manageSession";
import { CreateDrawer, DeleteDrawer, GetDrawerById, GetUsersDrawers, GetWordsOfDrawer, PutWordInDrawer, RemoveWordFromDrawer, UpdateDrawerName } from "./db";
import { STATUS } from "@/actions/manageSession";
import { logOutUser } from "@/actions/auth/user";
import { cookies } from "next/headers";

type createState  = {
    success: boolean;
    accessToken: string | undefined;
} | undefined;

export async function createDrawer(state : createState, formData : FormData){
    const drawerTitle = formData.get('title')?.toString() || '';
    const aToken = formData.get('accessToken')?.toString() || '';

    const sessionStatus = await verifySession(aToken);

    if(STATUS.UNAUTHORIZED === sessionStatus){
        await logOutUser();

        return {success: false, accessToken: ''};
    }else if(STATUS.ACCESS_NEEDED ===  sessionStatus){
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const {userId} = payload as TokenPayload;
        const res = await CreateDrawer(drawerTitle, userId);

        const accessToken = await encryptAccess(payload);

        if(res)
            return {success: true, accessToken: accessToken};
        
        return {success: false, accessToken: ''};
    }else if(STATUS.VALID_ACCESS === sessionStatus){    
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const {userId} = payload as TokenPayload;
        const res = await CreateDrawer(drawerTitle, userId);

        if(res)
            return {success: true, accessToken: aToken};
        
        return {success: false, accessToken: ''};
    }
}



export async function getUsersDrawers(aToken : string){

    const sessionStatus = await verifySession(aToken);

    if(STATUS.UNAUTHORIZED === sessionStatus){
        await logOutUser();

        return {success: false, accessToken: ''};
    }else if(STATUS.ACCESS_NEEDED ===  sessionStatus){
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const {userId} = payload as TokenPayload;
        const res = await GetUsersDrawers(userId);

        const accessToken = await encryptAccess(payload);

        if(res)
            return {success: true, accessToken: accessToken, data: res};
        
        return {success: false, accessToken: ''};
    }else if(STATUS.VALID_ACCESS === sessionStatus){    
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const {userId} = payload as TokenPayload;
        const res = await GetUsersDrawers(userId);

        if(res)
            return {success: true, accessToken: aToken, data: res};
        
        return {success: false, accessToken: ''};
    }
}


export async function updateDrawerName(state : {success : boolean, accessToken : string} | undefined, formData : FormData){
    const aToken = formData.get('accessToken')?.toString() || '';
    const drawerName = formData.get('drawerName')?.toString() || '';
    const drawerId = Number(formData.get('drawerId'));
    if(drawerId === -1)
        return;
    
    const sessionStatus = await verifySession(aToken);

    if(STATUS.UNAUTHORIZED === sessionStatus){
        await logOutUser();

        return {success: false, accessToken: ''};
    }else if(STATUS.ACCESS_NEEDED ===  sessionStatus){
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const res = await UpdateDrawerName(drawerName, drawerId);

        const accessToken = await encryptAccess(payload);

        if(res)
            return {success: true, accessToken: accessToken};
        
        return {success: false, accessToken: ''};
    }else if(STATUS.VALID_ACCESS === sessionStatus){    
        const res = await UpdateDrawerName(drawerName, drawerId);

        if(res)
            return {success: true, accessToken: aToken};
        
        return {success: false, accessToken: ''};
    }
}


export async function deleteDrawer(drawerId : number, aToken : string){
    const sessionStatus = await verifySession(aToken);

    if(STATUS.UNAUTHORIZED === sessionStatus){
        await logOutUser();

        return {success: false, accessToken: ''};
    }else if(STATUS.ACCESS_NEEDED ===  sessionStatus){
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const res = await DeleteDrawer(drawerId);

        const accessToken = await encryptAccess(payload);

        if(res)
            return {success: true, accessToken: accessToken};
        
        return {success: false, accessToken: ''};
    }else if(STATUS.VALID_ACCESS === sessionStatus){    
        const res = await DeleteDrawer(drawerId);

        if(res)
            return {success: true, accessToken: aToken};
        
        return {success: false, accessToken: ''};
    }
}


export async function putWordInDrawer(state : {success : boolean, accessToken : string} | undefined, formData : FormData){
    const aToken = formData.get('accessToken')?.toString() || '';
    const wordId = Number(formData.get('addedWordId'));
    const drawerId = Number(formData.get('drawerId'));

    if(wordId === -1)
        return;
    
    const sessionStatus = await verifySession(aToken);

    if(STATUS.UNAUTHORIZED === sessionStatus){
        await logOutUser();

        return {success: false, accessToken: ''};
    }else if(STATUS.ACCESS_NEEDED ===  sessionStatus){
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const res = await PutWordInDrawer(drawerId, wordId);

        const accessToken = await encryptAccess(payload);

        if(res)
            return {success: true, accessToken: accessToken};
        
        return {success: false, accessToken: ''};
    }else if(STATUS.VALID_ACCESS === sessionStatus){    
        const res = await PutWordInDrawer(drawerId, wordId);

        if(res)
            return {success: true, accessToken: aToken};
        
        return {success: false, accessToken: ''};
    }
}


export async function getWordsOfDrawer(drawerId : number){
    if(drawerId === -1)
        return;
    const words = await GetWordsOfDrawer(drawerId);

    return words?.map((entry) => entry.words);
}


export async function removeWordFromDrawer(aToken : string, drawerId : number, wordId : number){
    if(drawerId < 0 || wordId < 0)
        return;

    const sessionStatus = await verifySession(aToken);

    if(STATUS.UNAUTHORIZED === sessionStatus){
        await logOutUser();

        return {success: false, accessToken: ''};
    }else if(STATUS.ACCESS_NEEDED ===  sessionStatus){
        const refreshToken = (await cookies()).get('refreshToken')?.value;
        const payload = await decryptRefresh(refreshToken || '');
        const res = await RemoveWordFromDrawer(wordId, drawerId);

        const accessToken = await encryptAccess(payload);

        if(res)
            return {success: true, accessToken: accessToken};
        
        return {success: false, accessToken: ''};
    }else if(STATUS.VALID_ACCESS === sessionStatus){    
        const res = await RemoveWordFromDrawer(wordId, drawerId);

        if(res)
            return {success: true, accessToken: aToken};
        
        return {success: false, accessToken: ''};
    }
}


export async function getDrawerById(drawerId : number){
    if(drawerId < 0) 
        return;

    const res = await GetDrawerById(drawerId);

    return res;
}