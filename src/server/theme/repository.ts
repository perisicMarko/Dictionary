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
        throw new Error(`getThemeColors failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
