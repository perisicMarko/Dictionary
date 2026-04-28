import { deleteUnverifiedUsers, findAllUsers } from '@/features/auth/infrastructure/usersRepository';
import { deleteNotesById, findAllNotes } from '@/features/notes/infrastructure/repository';
import { TUser } from '@/shared/types';
import { NextResponse } from 'next/server';
import { isBefore } from 'date-fns';

export async function GET() {

    try {
        //retrieve db users
        const users = await findAllUsers();

        const now = new Date();
        //filter only unverified users
        let unverifiedUserIds: number[] = [];

        function determineUserDeletion(u: TUser){
            if(!u.email_verified) 
                if(!u.account_action_token || (u.account_action_token && isBefore(u.account_action_token_expires_at as Date, now))) // if user is trying to register, do not delete him in 15 minutes window
                    return true;
            return false;
        }
        if (Array.isArray(users))
            unverifiedUserIds = users?.filter((u: TUser) => determineUserDeletion(u)).map((u: TUser) => { return u.id });

        //delete unverified users
        await deleteUnverifiedUsers(unverifiedUserIds);
        
        //retrieve all db notes
        const notes = await findAllNotes();

        //filter all notes of unverified users
        let unverifiedNoteIds: number[] = [];
        if (Array.isArray(notes))
            unverifiedNoteIds = notes?.filter(n => unverifiedUserIds.includes(n.user_id)).map(n => { return n.id });
        //delete unverified notes
        await deleteNotesById(unverifiedNoteIds);

        return NextResponse.json({ success: 'All done.', status: 200 });
    } catch (error) {
        const message = (error instanceof Error && error.message);
        return NextResponse.json({ error: 'Error occured while deleting unverified database items: ' + message, status: 500 });
    }
}
