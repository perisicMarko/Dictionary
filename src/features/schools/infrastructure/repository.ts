import 'server-only'
import { prisma } from '@/server/db/client';

export async function insertSchoolInfo(name: string, email: string, password: string) {

    try {
        const res = await prisma.schools.create({
            data: {
                email: email,
                password: password
            }
        });

        return res;
    } catch (error) {
        throw new Error(`insertSchoolInfo failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function findSchoolByEmail(email: string) {

    try {
        const res = await prisma.schools.findFirst({
            where: { email: email }
        });

        return res;
    } catch (error) {
        throw new Error(`findSchoolByEmail failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function findSchoolPartnershipByEmail(email: string) {

    try {
        const res = await prisma.school_partners.findFirst({
            where: { school_email: email }
        });

        return res;
    } catch (error) {
        throw new Error(`findSchoolPartnershipByEmail failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function insertActivationKey(email: string, activationKeyExpirationDate: Date, schoolId: number) {

    try {
        const res = await prisma.subscriptions.create({
            data: {
                email: email,
                key_expiration_date: activationKeyExpirationDate,
                school_id: schoolId,
                languages: 'e'
            }
        });

        return res;
    } catch (error) {
        throw new Error(`insertActivationKey failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}


export async function updateActivationKey(email: string, activationKeyExpirationDate: Date, schoolId: number) {

    try {
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
    } catch (error) {
        throw new Error(`updateActivationKey failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}


export async function findSubscriptionByEmail(email: string) {

    try {
        const res = await prisma.subscriptions.findUnique({
            where: {
                email: email
            }
        });

        return res;
    } catch (error) {
        throw new Error(`findSubscriptionByEmail failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function findAllSubscriptionsBySchoolId(schoolId: number) {

    try {
        const res = await prisma.subscriptions.findMany({
            where: {
                school_id: schoolId
            }
        });

        return res;
    } catch (error) {
        throw new Error(`findAllSubscriptionsBySchoolId failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function updateSubscriptionEmail(email : string, newEmail : string) {

    try {
        const res = await prisma.subscriptions.update({
            data: {
                email: newEmail
            },
            where: {
                email: email
            }
        });

        return res;
    } catch (error) {
        throw new Error(`updateSubscriptionEmail failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
