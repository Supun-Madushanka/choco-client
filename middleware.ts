import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login"];

const ROLE_ROUTES: Record<string, string> = {
  HR_MANAGER: "/dashboard/hr",
  SUPER_ADMIN: "/dashboard/admin",
  PRODUCTION_MANAGER: "/dashboard/production",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && isPublicRoute) {
    const route = userRole ? (ROLE_ROUTES[userRole] ?? "/dashboard") : "/dashboard";
    return NextResponse.redirect(new URL(route, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};