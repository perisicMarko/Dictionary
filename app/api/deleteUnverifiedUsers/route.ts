import { DeleteUnverifiedNotes, DeleteUnverifiedUsers, GetNotes, GetUsers } from '@/lib/db';
import { TDBNoteEntry, TUser } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function GET() {
    
    try{//retrieve db users
        const tmp = await GetUsers();
        const users = (tmp != undefined && await tmp.json());
        

        //filter only unverified users
        const unverifiedUsersIds = users?.filter((u : TUser) => !u.email_verified).map((u : TUser) => { return u.id });

        //retrieve all db notes
        const tmp1 = await GetNotes();
        const notes = (tmp1 != undefined && await tmp1?.json());

        //filter all notes of unverified users
        const unverifiedNotesIds = notes.filter((n : TDBNoteEntry) => n.user_id in unverifiedUsersIds).map((n : TUser) => { return n.id });


        //delete unverified notes
        await DeleteUnverifiedNotes(unverifiedNotesIds);

        //delete unverified users
        await DeleteUnverifiedUsers(unverifiedUsersIds)

        return NextResponse.json({success: 'Mail was successfylly sent.', status: 200})
    }catch(error){
        const message =  (error instanceof Error && error.message);
        return NextResponse.json({ error: 'Error when sending mail: ' + message, status: 500});
    }

}
