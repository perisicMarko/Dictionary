import 'server-only'
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function InsertSchoolInfo(name: string, email: string, password: string){

    try{
        const res = await prisma.schools.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        });

        return res;
    }catch (error) {
        
        if(error instanceof Error){
            console.log('GetNotes: ERROR: API - ', error?.message);
        }

    }
}

export async function GetSchoolByEmail(email: string){

    try{
        const res = await prisma.schools.findFirst({
            where: {email: email}
        });

        return res;
    }catch (error) {
        
        if(error instanceof Error){
            console.log('GetNotes: ERROR: API - ', error?.message);
        }

    }
}

export async function CheckPartnership(email: string){

    try{
        const res = await prisma.school_partners.findFirst({
            where: {school_email: email}
        });

        return res;
    }catch (error) {
        
        if(error instanceof Error){
            console.log('GetNotes: ERROR: API - ', error?.message);
        }

    }
}