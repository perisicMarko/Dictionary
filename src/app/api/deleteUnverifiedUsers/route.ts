import { DeleteUnverifiedUsers, GetUsers } from '@/features/auth/infrastructure/usersRepository';
import { DeleteUnverifiedNotes, findAllNotesWithDictionaryWord } from '@/features/notes/infrastructure/repository';
import { TUser } from '@/lib/types';
import { NextResponse } from 'next/server';
import { isBefore } from 'date-fns';

export async function GET() {

    try {
        //retrieve db users
        const users = await GetUsers();

        const now = new Date();
        //filter only unverified users
        let unverifiedUserIds: number[] = [];

        function determineUserDeletion(u: TUser){
            if(!u.email_verified) 
                if(!u.refresh_token || (u.refresh_token && isBefore(u.refresh_token_expiration_date as Date, now))) // if user is trying to register, do not delete him in 15 minutes window
                    return true;
            return false;
        }
        if (Array.isArray(users))
            unverifiedUserIds = users?.filter((u: TUser) => determineUserDeletion(u)).map((u: TUser) => { return u.id });

        //delete unverified users
        await DeleteUnverifiedUsers(unverifiedUserIds);
        
        //retrieve all db notes
        const notes = await findAllNotesWithDictionaryWord();

        //filter all notes of unverified users
        let unverifiedNoteIds: number[] = [];
        if (Array.isArray(notes))
            unverifiedNoteIds = notes?.filter(n => unverifiedUserIds.includes(n.user_id)).map(n => { return n.id });
        //delete unverified notes
        await DeleteUnverifiedNotes(unverifiedNoteIds);

        return NextResponse.json({ success: 'All done.', status: 200 });
    } catch (error) {
        const message = (error instanceof Error && error.message);
        return NextResponse.json({ error: 'Error occured while deleting unverified database items: ' + message, status: 500 });
    }
}
