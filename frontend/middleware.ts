import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
    matcher: ["/((?!_next/|api/|static/|favicon.ico|favicon/).*)"],
};

const PUBLIC_ROUTES = ["/", "/register", "/forgot-password", "/reset-password"];
const DASHBOARD_ROUTE = "/dashboard";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    // Redirect to login if neither token exists and trying to access protected route
    if (!accessToken && !refreshToken && !isPublic) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect to dashboard if access token exists and trying to access public route
    if (accessToken && isPublic) {
        console.log("redirecting to dashboard");
        return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
    }

    return NextResponse.next();
}
