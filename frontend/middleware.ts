import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
    matcher: ["/((?!_next/|api/|static/|favicon.ico|favicon/).*)"],
};

const PUBLIC_ROUTES = ["/", "/register", "/forgot-password", "/reset-password"];
const DASHBOARD_ROUTE = "/dashboard";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("accessToken")?.value;
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (token && isPublic) {
        return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
    }

    return NextResponse.next();
}
