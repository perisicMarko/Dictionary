import { NextRequest, NextResponse } from "next/server";
import GetAuthUser  from '@/actions/getAuthUser';

const protectedRoutes = [''];
const publicRoutes = ['/', '/signUp', '/logIn', '/about'];


export default async function middleware(req : NextRequest){
    const path = req.nextUrl.pathname;

    const isProtected = protectedRoutes.includes(path) || path.startsWith('/user');
    const isPublic = publicRoutes.includes(path);

    const user = await GetAuthUser();
    const userId = user?.userId;
    const start = path.indexOf('user/')+5;
    const end = path.indexOf('/', start);
    const urlId = (end == -1 ? path.substring(start) : path.substring(start, end));

    if(isProtected && !userId)
        return NextResponse.redirect(new URL('/logIn', req.nextUrl));
    else if(isProtected)
        if(urlId != userId)
            return NextResponse.redirect(new URL('/user/' + userId, req.nextUrl));

    if(isPublic && userId)
        return NextResponse.redirect(new URL('/user/' + userId, req.nextUrl));

    return NextResponse.next();
}