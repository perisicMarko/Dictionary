import 'server-only';
import { prisma } from "@/server/db/client";

export async function findUserById(id: number) {

  try {
    const res = prisma.users.findUnique({ where: { id: id } });

    return res;
  } catch (error) {
    throw new Error(`findUserById failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function findUserByEmail(email : string) {

  try {
    const res = await prisma.users.findFirst({ where: { email: email } });

    return res;
  } catch (error) {
    throw new Error(`findUserByEmail failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}


export async function insertUser(name: string, lastName: string, email: string, password: string, schoolId: number) {

  try {
    const res = await prisma.users.create({
      data: {
        first_name: name,
        last_name: lastName,
        email: email,
        password: password,
        school_id: schoolId,
        languages: 'e'
      }
    });


    return res;
  } catch (error) {
    throw new Error(`insertUser failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}



export async function updateUserRefreshTokenById(userId: number, refreshToken: Base64URLString | null, tokenExpirationDate: Date | null) {

  try {
    const res = await prisma.users.update({ where: { id: userId }, data: { refresh_token: refreshToken, refresh_token_expiration_date: tokenExpirationDate } });

    return res;
  } catch (error) {
    throw new Error(`updateUserRefreshTokenById failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function findUserByToken(refreshToken: Base64URLString) {

  try {
    const res = await prisma.users.findFirst({ where: { refresh_token: refreshToken } });

    return res;
  } catch (error) {
    throw new Error(`findUserByToken failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}


export async function updateUserPasswordById(userId: number, password: string) {

  try {
    const res = await prisma.users.update({ where: { id: userId }, data: { password: password } });

    return res;
  } catch (error) {
    throw new Error(`updateUserPasswordById failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}


export async function verifyUserById(userId: number) {

  try {
    const res = await prisma.users.update({ where: { id: userId }, data: { refresh_token: null, refresh_token_expiration_date: null, email_verified: true } });

    return res;
  } catch (error) {
    throw new Error(`verifyUserById failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}


export async function findAllUsers() {

  try {
    const res = await prisma.users.findMany();

    return res;
  } catch (error) {
    throw new Error(`findAllUsers failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}



export async function deleteUnverifiedUsers(ids: number[]) {

  try {
    let res;
    for (const id of ids)
      res = await prisma.users.deleteMany({ where: { id: id } });

    return res;
  } catch (error) {
    throw new Error(`deleteUnverifiedUsers failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}


export async function changeSchoolForUser(userId: number, schoolId: number) {

  try {
    const res = await prisma.users.update({
      where: {id: userId},
      data: {school_id: schoolId}
    });
    
    return res;
  } catch (error) {
    throw new Error(`changeSchoolForUser failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function findAllUsersBySchoolId(schoolId: number){

  try {
    const res = await prisma.users.findMany({
      include: {
        subscriptions: true
      },
      where: { school_id: schoolId },
    });
    
    return res;
  } catch (error) {
    throw new Error(`findAllUsersBySchoolId failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
