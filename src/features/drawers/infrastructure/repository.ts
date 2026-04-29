import 'server-only';
import { prisma } from '@/server/db/client';

export async function insertDrawer(title: string, userId: number) {
    try {
        const res = await prisma.drawers.create({
            data: {
                name: title,
                user_id: userId
            }
        });

        return res;
    } catch (e) {
        throw new Error(`insertDrawer failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}

export async function findDrawersByUserId(userId: number) {
    try {
        const drawers = await prisma.drawers.findMany({
            where: {
                user_id: userId
            }
        });

        return drawers;
    } catch (e) {
        throw new Error(`findDrawersByUserId failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}

export async function updateDrawerNameById(drawerName: string, drawerId: number) {
    try {
        const res = await prisma.drawers.update({
            where: {
                id: drawerId
            },
            data: {
                name: drawerName
            }
        });

        return res;
    } catch (e) {
        throw new Error(`updateDrawerNameById failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}

export async function deleteDrawerById(drawerId: number) {
    try {
        const res = await prisma.drawers.delete({
            where: {
                id: drawerId
            }
        });

        return res;
    } catch (e) {
        throw new Error(`deleteDrawerById failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}


export async function attachNoteToDrawer(drawerId: number, noteId: number) {
    try {

        const exist = await prisma.drawers_and_notes.findFirst({ where: { drawer_id: drawerId, note_id: noteId } });
        if(exist)
            return {success: true, message: 'Item already exists.'};

        const res = await prisma.drawers_and_notes.create({
            data: {
                note_id: noteId,
                drawer_id: drawerId
            }
        });

        return res;
    } catch (e) {
        throw new Error(`attachNoteToDrawer failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}


export async function findAllNotesWithDictionaryWordOfDrawer(drawerId: number) {
    try {
        const res = await prisma.drawers_and_notes.findMany({
            where: {
                drawer_id: drawerId,
            },
            include: {
                notes: {
                    include: {
                        dictionary_words: true
                    }
                }
            },
        });

        return res;
    } catch (e) {
        throw new Error(`findAllNotesWithDictionaryWordOfDrawer failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}


// bad database design, but i need this for the mapping of drawers and notes in the frontend
// mapping is stored with drawer_id and note_id, but i need to find all drawers and their notes for a specific user
export async function findNoteDrawerMappingByUserId(userId: number) {
    try {
        const resDrawersIds = await prisma.drawers.findMany({
            where: {
                user_id: userId
            }, 
            select: {
                id: true,
            }
        });

        try {

            const resDrawerIdNoteIdMapping = await prisma.drawers_and_notes.findMany({
                where: {
                    drawer_id: {
                        in: resDrawersIds.map((d) => d.id)
                    }
                }});

            return resDrawerIdNoteIdMapping;
        } catch (e) {
            throw new Error(`findNoteDrawerMappingByUserId failed at drawers_and_notes query: ${e instanceof Error ? e.message : String(e)}`);
        }
    } catch (e) {
        throw new Error(`findAllNotesWithDictionaryWordOfDrawer failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}



export async function removeNoteFromDrawer(noteId: number, drawerId: number) {
    try {
        const res = await prisma.drawers_and_notes.deleteMany({
            where: {
                drawer_id: drawerId,
                note_id: noteId,
            },
        });

        return res;
    } catch (e) {
        throw new Error(`removeNoteFromDrawer failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}


export async function findDrawerById(drawerId: number) {
    try {
        const res = await prisma.drawers.findUnique({
            where: {
                id: drawerId
            },
        });

        return res;
    } catch (e) {
        throw new Error(`findDrawerById failed: ${e instanceof Error ? e.message : String(e)}`);
    }
}
