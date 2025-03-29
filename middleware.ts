import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [''];
const publicRoutes = ['/', '/signUp', '/logIn', '/about'];

export default function middleware(req : NextRequest){
    const path = req.nextUrl.pathname;

    const isProtected = protectedRoutes.includes(path) || path.startsWith('/dictionary');
    const isPublic = publicRoutes.includes(path);

    //temporary light check, just check the existance of the session, when i implement refresh access token funcionality this will be changed
    const session = req.cookies.get('session')?.value;  
    const userId = session ? true : false;

    if(path.indexOf('resetPassword') != -1){
        //allows direct access to resetPassword page
        return;
    }

    if(isProtected && !userId)
        return NextResponse.redirect(new URL('/logIn', req.nextUrl));

    if(isPublic && userId)
        return NextResponse.redirect(new URL('/dictionary/inputWord', req.nextUrl));

return NextResponse.next();
}