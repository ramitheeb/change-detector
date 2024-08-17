import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfigs from "lib/auth/configs";

const publicAppPaths = [
  "/auth/sign-in",
  "/auth/verify-request",
  "/api/auth",
  "/api/webhooks/change-event",
];

export default NextAuth(authConfigs).auth(async (req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/auth/sign-in" && req.auth) {
    return NextResponse.redirect(new URL("/app", req.nextUrl.href));
  }

  const isPublicAppPath = publicAppPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isPublicAppPath || pathname === "/") {
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(
      new URL(
        `/auth/sign-in?redirectTo=${encodeURIComponent(req.nextUrl.href)}`,
        req.url
      )
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
