import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [''];
const publicRoutes = ['/', '/signUp', '/logIn', '/about'];

export default function middleware(req : NextRequest){
    const path = req.nextUrl.pathname;

    const isProtected = protectedRoutes.includes(path) || path.startsWith('/user');
    const isPublic = publicRoutes.includes(path);

    const userId = req.cookies.get("userId")?.value;
    const start = path.indexOf('user/')+5;
    const end = path.indexOf('/', start);
    const urlId = (end == -1 ? path.substring(start) : path.substring(start, end));

    if(isProtected && !userId)
        return NextResponse.redirect(new URL('/logIn', req.nextUrl));
    else if(isProtected)
        if(urlId != userId)
            return NextResponse.redirect(new URL('/user/' + userId + '/inputWord', req.nextUrl));

    if(isPublic && userId)
        return NextResponse.redirect(new URL('/user/' + userId + '/inputWord', req.nextUrl));

    return NextResponse.next();
}