import { DeleteUnverifiedUsers, GetUsers } from '@/actions/manageUsers/db';
import { DeleteUnverifiedNotes, GetNotes } from '@/actions/manageNotes/db';
import { TDBNoteEntry, TUser } from '@/lib/types';
import { NextResponse } from 'next/server';

export async function GET() {

    try {
        //retrieve db users
        const users = await GetUsers();

        //filter only unverified users
        let unverifiedUserIds: number[] = [];
        if (Array.isArray(users))
            unverifiedUserIds = users?.filter((u: TUser) => !u.email_verified).map((u: TUser) => { return u.id });

        //delete unverified users
        await DeleteUnverifiedUsers(unverifiedUserIds || [])

        //retrieve all db notes
        const notes = await GetNotes();

        //filter all notes of unverified users
        let unverifiedNoteIds: number[] = [];
        if (Array.isArray(notes))
            unverifiedNoteIds = notes?.filter((n: TDBNoteEntry) => n.user_id in unverifiedUserIds).map((n: TDBNoteEntry) => { return n.id });

        //delete unverified notes
        await DeleteUnverifiedNotes(unverifiedNoteIds || []);

        return NextResponse.json({ success: 'Unverified items have been deleted', status: 200 })
    } catch (error) {
        const message = (error instanceof Error && error.message);
        return NextResponse.json({ error: 'Error occured while deleting unverified database items: ' + message, status: 500 });
    }
}
