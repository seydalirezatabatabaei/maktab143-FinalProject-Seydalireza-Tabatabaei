import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // صفحه ورود آزاد است
  if (pathname === "/admin/register") {
    return NextResponse.next();
  }

  // فقط مسیرهای admin محافظت شوند
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin_session")?.value;

    if (!session) {
      const loginUrl = new URL("/admin/register", request.url);

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};