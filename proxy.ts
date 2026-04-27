import { NextRequest, NextResponse } from "next/server";
import { decryptRefresh, decryptSession } from "@/server/auth/session";

const protectedRoutes = ['/dictionary/yourWords', '/dictionary/inputWord', '/dictionary/history', '/dictionary/recall'];
const publicRoutes = ['/', '/signUp', '/logIn', '/about'];
const schoolPublicRoutes = ['/school', '/school/signUp'];
const schoolProtectedRoutes = ['/school/platform/students', '/school/platform/generateKey', '/school/platform/subscriptions'];

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtected = path.startsWith('/dictionary');
    const isPublic = publicRoutes.includes(path);
    const refreshToken = req.cookies.get('refreshToken')?.value;
    
    const schoolSessionToken = req.cookies.get('sessionToken')?.value;
    const isSchoolProtected = path.startsWith('/school/platform');
    const isSchoolPublic = schoolPublicRoutes.includes(path);
    
    if(isProtected){
        if(!refreshToken)
            return NextResponse.redirect(new URL('/', req.nextUrl));
        const payload = await decryptRefresh(refreshToken as string);
        if(!payload)
            return NextResponse.redirect(new URL('/', req.nextUrl));

        if(protectedRoutes.includes(path) || path.includes('edit')) // checking if typed route is correct if it is not but token is valid, redirect to input page
            return NextResponse.next();
        else 
            return NextResponse.redirect(new URL('/dictionary/inputWord', req.nextUrl));
    }else if(isPublic){
        if(!refreshToken)
            return NextResponse.next();
        const payload = await decryptRefresh(refreshToken as string);
        if(!payload)
            return NextResponse.next();
        
        return NextResponse.redirect(new URL('/dictionary/inputWord', req.nextUrl));
    }else if(isSchoolPublic){ // middleware for school platform
        if(!schoolSessionToken)
            return NextResponse.next();
        const payload = await decryptSession();
        if(!payload)
            return NextResponse.next();

        return NextResponse.redirect(new URL('/school/platform/students', req.nextUrl));
    }else if(isSchoolProtected){
        if(!schoolSessionToken)
            return NextResponse.redirect(new URL('/school', req.nextUrl));
        const payload = await decryptSession();
        if(!payload)
            return NextResponse.redirect(new URL('/school', req.nextUrl));

        if(schoolProtectedRoutes.includes(path))
            return NextResponse.next();
        else
            return NextResponse.redirect(new URL('/school/platform/students', req.nextUrl));
    }

    return NextResponse.next(); // letting all other requests to pass
}
