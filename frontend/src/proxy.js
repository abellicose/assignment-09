import { NextResponse } from "next/server";

export function proxy(request) {
    if (!request.cookies.has("token")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/facilities/:path+']
}
