import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/accept-invitation",
];

// Which roles can access which routes
const roleRouteAccess: Record<string, string[]> = {
    SUPER_ADMIN: [
        "/dashboard/overview",
        "/dashboard/users",
        "/dashboard/hr",
        "/dashboard/raw-materials",
        "/dashboard/suppliers",
        "/dashboard/production",
        "/dashboard/inventory",
        "/dashboard/sales",
        "/dashboard/finance",
        "/dashboard/reports",
        "/dashboard/settings",
        "/dashboard/profile",
        "/dashboard/change-password",
    ],
    HR_MANAGER: [
        "/dashboard/hr",
        "/dashboard/reports",
        "/dashboard/profile",
        "/dashboard/change-password",
    ],
    PRODUCTION_MANAGER: [
        "/dashboard/production",
        "/dashboard/inventory",
        "/dashboard/raw-materials",
        "/dashboard/reports",
    ],
    //add other roles and their allowed routes here
};

// Default dashboard per role
const roleDashboards: Record<string, string> = {
    SUPER_ADMIN:           "/dashboard/overview",
    HR_MANAGER:            "/dashboard/hr",
    PRODUCTION_MANAGER:    "/dashboard/production",
    //add other roles and their default dashboards here
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("accessToken")?.value;
    const role = request.cookies.get("userRole")?.value;

    const isPublicRoute = publicRoutes.some(
        (route) => pathname.startsWith(route)
    );

    // No token → redirect to login
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    // Has token + public route → redirect to dashboard
    if (token && isPublicRoute) {
        const defaultDash = role
            ? roleDashboards[role]
            : "/dashboard/overview";
        return NextResponse.redirect(
            new URL(defaultDash, request.url)
        );
    }

    // Has token + dashboard route → check role access
    if (token && role && pathname.startsWith("/dashboard")) {
        const allowedRoutes = roleRouteAccess[role] || [];
        const hasAccess = allowedRoutes.some(
            (route) => pathname.startsWith(route)
        );

        if (!hasAccess) {
            // Redirect to their default dashboard
            const defaultDash = roleDashboards[role] ||
                "/dashboard/overview";
            return NextResponse.redirect(
                new URL(defaultDash, request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};