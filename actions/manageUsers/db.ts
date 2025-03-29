import 'server-only';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetUserInfoById(id: number) {

  try {
    const res = prisma.user.findMany({ where: { id: id } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('GetUserInfoById: ERROR: API - ', error?.message);
    }

  }
}

export async function GetUserInfoByEmail({ email }: { email: string }) {

  try {
    const res = await prisma.user.findFirst({ where: { email: email } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('GetUserInfoByEmail: ERROR: API - ', error?.message);
    }

  }
}


export async function InsertUserInfo({ name, lastName, email, password }: { name: string, lastName: string, email: string, password: string }) {

  try {
    const res = await prisma.user.create({
      data: {
        first_name: name,
        last_name: lastName,
        email: email,
        password: password,
      }
    })


    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('InsertUserInfo: ERROR: API - ', error.message);
    }

  }
}



export async function UpdateUsersRefreshToken(userId: number, refreshToken: Base64URLString | null, tokenExpirationDate: Date | null) {

  try {
    const res = await prisma.user.update({ where: { id: userId }, data: { refresh_token: refreshToken, refresh_token_expiration_date: tokenExpirationDate } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('UpdateUsersToken: ERROR: API - ' + error.message);
    }

  }
}

export async function GetUserByToken(refreshToken: Base64URLString) {

  try {
    const res = await prisma.user.findFirst({ where: { refresh_token: refreshToken } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('GetuserByToken: ERROR: API - ' + error.message);
    }

  }
}


export async function UpdateUsersPassword(userId: number, password: string) {

  try {
    const res = await prisma.user.update({ where: { id: userId }, data: { password: password } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('UpdateUsersPassword: ERROR: API - ' + error.message);
    }

  }
}


export async function VerifyUser(userId: number) {

  try {
    const res = await prisma.user.update({ where: { id: userId }, data: { refresh_token: null, refresh_token_expiration_date: null, email_verified: true } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('UpdateUsersPassword: ERROR: API - ' + error.message);
    }

  }
}


export async function GetUsers() {

  try {
    const res = await prisma.user.findMany();

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('GetUsers: ERROR: API - ' + error.message);
    }

  }
}



export async function DeleteUnverifiedUsers(ids: number[]) {

  try {
    let res;
    for (const id of ids)
      res = await prisma.user.deleteMany({ where: { id: id } });

    return res;
  } catch (error) {

    if (error instanceof Error) {
      console.log('DeleteUnverifiedUsers: ERROR: API - ' + error.message);
    }

  }
}
