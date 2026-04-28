'server-only';
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
    .sign(ACCESS_SECRET);
}

export type TokenPayload = {
  email: string;
  userId: number;
  exp: number;
};

export const STATUS = {
  UNAUTHORIZED: 0,
  VALID_ACCESS: 1,
  ACCESS_NEEDED: 2,
} as const;

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

export async function requireAuthenticatedUser() {
  const cookieStore = await cookies();

  const refreshTokenCookie = cookieStore.get('refreshToken')?.value;
  if (!refreshTokenCookie) {
    return undefined;
  }

  const refreshToken = await decryptRefresh(refreshTokenCookie);
  if (!refreshToken) {
    return undefined;
  }

  const accessTokenCookie = cookieStore.get('accessToken')?.value;
  if (!accessTokenCookie) {
    await issueTokensForUser(refreshToken.email, refreshToken.userId);
    return { email: refreshToken.email, userId: refreshToken.userId };
  }

  const newAccessToken = await encryptAccess({
    email: refreshToken.email,
    userId: refreshToken.userId,
  });

  (await cookies()).set('accessToken', newAccessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 15,
  });

  return { email: refreshToken.email, userId: refreshToken.userId };
}

export async function verifySession(accessToken: string | undefined) {
  if (!accessToken) {
    return STATUS.UNAUTHORIZED;
  }

  const payload = await decryptAccess(accessToken);
  if (payload) {
    return STATUS.VALID_ACCESS;
  }

  return STATUS.ACCESS_NEEDED;
}

export async function issueTokensForUser(email: string, userId: number) {
  const refreshToken = await encryptRefresh({ email: email, userId: userId });
  const accessToken = await encryptAccess({ email: email, userId: userId });

  (await cookies()).set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  (await cookies()).set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 15,
  });
}
