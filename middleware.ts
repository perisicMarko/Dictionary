import { NextRequest, NextResponse } from "next/server";
import { decryptRefresh, decryptSession, TokenPayload } from "./actions/manageSession";

const protectedRoutes = [''];
const publicRoutes = ['/', '/signUp', '/logIn', '/about'];
const schoolProtectedRoutes = ['/school/students', '/school/generateKey'];
const schoolPublicRoutes = ['/school', '/school/signUp'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.includes(path) || path.startsWith('/dictionary');
    const isPublic = publicRoutes.includes(path);
    const refreshToken = req.cookies.get('refreshToken')?.value;
    
    const schoolSessionToken = req.cookies.get('sessionToken')?.value;
    const isSchoolProtected = schoolProtectedRoutes.includes(path);
    const isSchoolPublic = schoolPublicRoutes.includes(path);
    
    if(isProtected){
        if(!refreshToken)
            return NextResponse.redirect(new URL('/', req.nextUrl));
        const payload = await decryptRefresh(refreshToken as string);
        if(!payload)
            return NextResponse.redirect(new URL('/', req.nextUrl));
        const { userId } = (payload as TokenPayload);
        if(userId)
            return NextResponse.next();
        else
            return NextResponse.redirect(new URL('/', req.nextUrl));
    }else if(isPublic){
        if(!refreshToken)
            return NextResponse.next();
        const payload = await decryptRefresh(refreshToken as string);
        if(!payload)
            return NextResponse.next();
        const { userId } = payload as TokenPayload;
        if(userId)
            return NextResponse.redirect(new URL('/dictionary/inputWord', req.nextUrl));
        else
            return NextResponse.next();
    }else if(isSchoolPublic){ // middleware for school platform
        if(!schoolSessionToken)
            return NextResponse.next();
        const payload = await decryptSession();
        if(!payload)
            return NextResponse.next();
        const { email } = payload;
        if(email)
            return NextResponse.redirect(new URL('/school/dashboard', req.nextUrl));
        else
            return NextResponse.next();
    }else if(isSchoolProtected){
        if(!schoolSessionToken)
            return NextResponse.redirect(new URL('/school', req.nextUrl));
        const payload = await decryptSession();
        if(!payload)
            return NextResponse.redirect(new URL('/school', req.nextUrl));
        const { email } = payload;
        if(email)
            return NextResponse.next();
        else
            return NextResponse.redirect(new URL('/school', req.nextUrl));
    }

    return NextResponse.next(); // letting all other requests to pass
}
