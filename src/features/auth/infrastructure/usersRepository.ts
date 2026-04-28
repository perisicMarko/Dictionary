import 'server-only';
import { prisma } from "@/server/db/client";

export async function findUserById(id: number) {

  try {
    const res = prisma.users.findUnique({ where: { id: id } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('findUserById: ERROR: API - ', error?.message);
    }

  }
}

export async function findUserByEmail(email : string) {

  try {
    const res = await prisma.users.findFirst({ where: { email: email } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('findUserByEmail: ERROR: API - ', error?.message);
    }

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

    if (error instanceof Error) {
      console.log('insertUser: ERROR: API - ', error.message);
    }

  }
}



export async function updateUserRefreshTokenById(userId: number, refreshToken: Base64URLString | null, tokenExpirationDate: Date | null) {

  try {
    const res = await prisma.users.update({ where: { id: userId }, data: { refresh_token: refreshToken, refresh_token_expiration_date: tokenExpirationDate } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('updateUserRefreshTokenById: ERROR: API - ' + error.message);
    }

  }
}

export async function findUserByToken(refreshToken: Base64URLString) {

  try {
    const res = await prisma.users.findFirst({ where: { refresh_token: refreshToken } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('findUserByToken: ERROR: API - ' + error.message);
    }

  }
}


export async function updateUserPasswordById(userId: number, password: string) {

  try {
    const res = await prisma.users.update({ where: { id: userId }, data: { password: password } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('updateUserPasswordById: ERROR: API - ' + error.message);
    }

  }
}


export async function verifyUserById(userId: number) {

  try {
    const res = await prisma.users.update({ where: { id: userId }, data: { refresh_token: null, refresh_token_expiration_date: null, email_verified: true } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('verifyUserById: ERROR: API - ' + error.message);
    }

  }
}


export async function findAllUsers() {

  try {
    const res = await prisma.users.findMany();

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('findAllUsers: ERROR: API - ' + error.message);
    }

  }
}



export async function deleteUnverifiedUsers(ids: number[]) {

  try {
    let res;
    for (const id of ids)
      res = await prisma.users.deleteMany({ where: { id: id } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('deleteUnverifiedUsers: ERROR: API - ' + error.message);
    }

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

    if (error instanceof Error) {
      console.log('changeSchoolForUser: ERROR: API - ' + error.message);
    }

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

    if (error instanceof Error) {
      console.log('findAllUsersBySchoolId: ERROR: API - ' + error.message);
    }

  }
}
