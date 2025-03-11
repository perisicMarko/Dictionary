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

    if(isProtected && !userId)
        return NextResponse.redirect(new URL('/logIn', req.nextUrl));

    if(isPublic && userId)
        return NextResponse.redirect(new URL('/user/' + userId, req.nextUrl));

    return NextResponse.next();
}