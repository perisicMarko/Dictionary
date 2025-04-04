import { NextRequest, NextResponse } from "next/server";
import { decryptRefresh, TokenPayload } from "./actions/manageSession";

const protectedRoutes = [''];
const publicRoutes = ['/', '/signUp', '/logIn', '/about'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.includes(path) || path.startsWith('/dictionary');
    const isPublic = publicRoutes.includes(path);

    const refreshToken = req.cookies.get('refreshToken')?.value;
    if(isProtected){
        if(!refreshToken)
            return NextResponse.redirect(new URL('/', req.nextUrl));
        const payload = await decryptRefresh(refreshToken || '');
        const { userId } = (payload as TokenPayload && payload as TokenPayload);
        if(userId)
            return NextResponse.next();
        else
            return NextResponse.redirect(new URL('/', req.nextUrl));
    }else if(isPublic){
        if(!refreshToken)
            return NextResponse.next();
        const payload = await decryptRefresh(refreshToken || '');
        const { userId } = (payload as TokenPayload && payload as TokenPayload);
        if(userId)
            return NextResponse.redirect(new URL('/dictionary/inputWord', req.nextUrl));
        else
            return NextResponse.next();
    }

    return NextResponse.next(); // letting all other requests to pass
}
