import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = request.nextUrl;

  if (!session) {
    if (pathname === "/" || pathname.startsWith("/teams")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  } else {
    if (
      pathname === "/sign-in" ||
      pathname === "/sign-up" ||
      pathname === "/"
    ) {
      return NextResponse.redirect(new URL("/teams", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/teams/:path*", "/sign-in", "/sign-up"],
};
