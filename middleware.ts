import { NextRequest, NextResponse } from "next/server";
import { ROLE_PERMISSIONS } from "./lib/permissions";

const PUBLIC_ROUTES = ["/login"];

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
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  if (accessToken && userRole) {
    const allowedRoutes =
      ROLE_PERMISSIONS[
        userRole as keyof typeof ROLE_PERMISSIONS
      ] ?? [];

    const isAllowed = allowedRoutes.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );

    if (!isAllowed) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};