'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET);

export type SessionPayload = {
  email: string;
  schoolId: number;
};

export async function createSession(email: string, schoolId: number) {
  const cookieStore = await cookies();

  const token = await new SignJWT({ email, schoolId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(ACCESS_SECRET);

  cookieStore.set('sessionToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
}

export async function decryptSession() {
  const token = (await cookies()).get('sessionToken')?.value || '';
  if (token == '')
    return;

  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET, {
      algorithms: ['HS256'],
    });

    const t = payload as SessionPayload;
    return t;
  } catch (error) {
    console.log('Failed session token decryption, error: ' + error);
  }
}
