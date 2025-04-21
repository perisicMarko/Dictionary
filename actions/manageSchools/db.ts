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
            console.log('InsertSchoolInfo: ERROR: API - ', error?.message);
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
            console.log('GetSchoolByEmail: ERROR: API - ', error?.message);
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
            console.log('CheckPartnership: ERROR: API - ', error?.message);
        }

    }
}

export async function CreateActivationKey(email: string, activationKeyExpirationDate: Date, schoolId: number){

    try{
        const res = await prisma.subscriptions.create({ 
            data: {
                email: email,
                key_expiration_date: activationKeyExpirationDate,
                school_id: schoolId,
            }
        });

        return res;
    }catch (error) {
        
        if(error instanceof Error){
            console.log('GenerateActivationKey: ERROR: API - ', error?.message);
        }

    }
}


export async function UpdateActivationKey(email: string, activationKeyExpirationDate: Date, schoolId: number){

    try{
        const res = await prisma.subscriptions.update({ 
            where: {
                email: email
            },
            data: {
                email: email,
                key_expiration_date: activationKeyExpirationDate,
                school_id: schoolId,
            }
        });

        return res;
    }catch (error) {
        
        if(error instanceof Error){
            console.log('GenerateActivationKey: ERROR: API - ', error?.message);
        }

    }
}


export async function GetSubscription(email: string){

    try{
        const res = await prisma.subscriptions.findUnique({ 
            where: {
                email: email
            }
        });

        return res;
    }catch (error) {
        
        if(error instanceof Error){
            console.log('GenerateActivationKey: ERROR: API - ', error?.message);
        }

    }
}