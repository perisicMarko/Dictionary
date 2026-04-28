'use server'
import { requireAuthenticatedUser } from "@/server/auth/session";
import { attachNoteToDrawer, deleteDrawerById, findAllNotesWithDictionaryWordOfDrawer, findDrawerById, findDrawersByUserId, insertDrawer, removeNoteFromDrawer, updateDrawerNameById } from "@/features/drawers/infrastructure/repository";
import { logOutUser } from "@/features/auth/application/userAuth";

type createState  = {
    success: boolean;
};


export async function createDrawer(state : createState | undefined, formData : FormData){
    const user = await requireAuthenticatedUser();
    if (!user) {
        await logOutUser();
        return { success: false };
    }
    
    const { userId } = user;
    const drawerTitle = (formData.get('title') as FormDataEntryValue).toString() as string;
    const res = await insertDrawer(drawerTitle, userId);

    return { success: true };
}



export async function getUsersDrawers(){
    const user = await requireAuthenticatedUser();
    if (!user) {
        await logOutUser();
        return { success: false };
    }
    
    const { userId } = user;
    const res = await findDrawersByUserId(userId);

    return { success: true, data: res };
}


export async function updateDrawerName(state : {success : boolean } | undefined, formData : FormData){
    const user = await requireAuthenticatedUser();
    if (!user) {
        await logOutUser();
        return { success: false };
    }
    
    const { userId } = user;

    const drawerName = formData.get('drawerName')?.toString() || '';
    const drawerId = Number(formData.get('drawerId'));

    const res = await updateDrawerNameById(drawerName, drawerId);

    return { success: true };
}


export async function deleteDrawer(drawerId : number){
    const user = await requireAuthenticatedUser();
    if (!user) {
        await logOutUser();
        return { success: false };
    }
    
    const res = await deleteDrawerById(drawerId);

    return {success: true };
}


export async function putNoteInDrawer(state : {success : boolean} | undefined, formData : FormData){
    const wordId = Number(formData.get('addedNoteId'));
    const drawerId = Number(formData.get('drawerId'));
    
    const res = await attachNoteToDrawer(drawerId, wordId);

    return {success: true};
}


export async function getNotesOfDrawer(drawerId : number){
    const user = await requireAuthenticatedUser();
    if (!user) {
        await logOutUser();
        return { success: false };
    }

    const notes = await findAllNotesWithDictionaryWordOfDrawer(drawerId);

    return {
        success: true,
        data: notes?.map((entry) => {
      const { status, ...rest } = entry.notes;

      return {
        ...rest,
        isLearned: status,
        dictionary_words: {
            meanings: entry.notes.dictionary_words?.meanings,
            word: entry.notes.dictionary_words?.word,
            audio: entry.notes.dictionary_words?.audio
        }
      };
    })}
}


export async function removeWordFromDrawer(drawerId : number, wordId : number){
    const user = await requireAuthenticatedUser();
    if (!user) {
        await logOutUser();
        return { success: false };
    }
    
    const res = await removeNoteFromDrawer(wordId, drawerId);

    return {success: true };
}


export async function getDrawerById(drawerId : number){
    const user = await requireAuthenticatedUser();
    if (!user) {
        await logOutUser();
        return { success: false };
    }
    
    if(drawerId < 0) 
        return;

    const res = await findDrawerById(drawerId);

    return { success: true, data: res};
}
