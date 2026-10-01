import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("admin_session")?.value;
  const session = sessionToken ? await verifySession(sessionToken) : null;

  if (pathname === "/admin/register") {
    return session
      ? NextResponse.redirect(new URL("/admin", request.url))
      : NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/admin/register", request.url);
      const callbackPath = `${pathname}${request.nextUrl.search}`;
      loginUrl.searchParams.set("callbackUrl", callbackPath);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_session");
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
