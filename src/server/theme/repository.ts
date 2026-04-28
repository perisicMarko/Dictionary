import 'server-only';
import { prisma } from '@/server/db/client';

export async function getThemeColors(userId: number) {
    try {
        const res = await prisma.users.findUnique({
            where: {
                id: userId
            },
            include: {
                schools: {
                    select:{
                        colors: true
                    }
                }
            }
        });

        return res;
    } catch (error) {

        if (error instanceof Error) {
            console.log('findAllNotesWithDictionaryWord: ERROR: API - ', error?.message);
        }

    }
}
