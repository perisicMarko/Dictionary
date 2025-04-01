import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET);
const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET);


export async function encryptRefresh(payload: JWTPayload | undefined) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET);
}

export async function encryptAccess(payload: JWTPayload | undefined) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(ACCESS_SECRET)
}

export type TokenPayload = {
  email: string;
  userId: number;
};

export async function decryptAccess(token: string) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET, {
      algorithms: ['HS256'],
    });

    const t = payload as TokenPayload;
    return t;
  } catch (error) {
    console.log('Failed access token decryption, error: ' + error);
  }
}


export async function decryptRefresh(token: string) {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET, {
      algorithms: ['HS256'],
    });

    const t = payload as TokenPayload;
    return t;
  } catch (error) {
    console.log('Failed refresh token decryption, error: ' + error);
  }
}

// 1 access token valid, 0 unauthorized, 2 no valid access(valid refresh) -> new access token needed
export const STATUS = {
  UNAUTHORIZED: 0,
  VALID_ACCESS: 1,
  ACCESS_NEEDED: 2,
};

export async function verifySession(accessString : string) {
  const cookieStore = await cookies();
  
  const accessToken = await decryptAccess(accessString);
  if (accessToken)
    return STATUS.VALID_ACCESS;
  
  const retVal = await decryptRefresh(cookieStore.get('refreshToken')?.value || '');
  if(retVal){
    console.log('VERIFY SESSION: RETURNED ACCESS NEEDED');
    return STATUS.ACCESS_NEEDED;
  }

  return STATUS.UNAUTHORIZED;
}