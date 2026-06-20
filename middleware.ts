import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DOMAIN_SUFFIX = ".groomy.com.ar";
const APP_SUBDOMAIN = "app";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Skip root domain (groomy.com.ar, www.groomy.com.ar)
  if (host === "groomy.com.ar" || host === "www.groomy.com.ar") {
    return NextResponse.next();
  }

  // Skip the app subdomain
  if (host === `app${DOMAIN_SUFFIX}`) {
    return NextResponse.next();
  }

  // Only apply subdomain rewrite for *.groomy.com.ar (not Vercel preview URLs)
  if (host.endsWith(DOMAIN_SUFFIX)) {
    const slug = encodeURIComponent(host.slice(0, -DOMAIN_SUFFIX.length));
    const url = request.nextUrl.clone();
    url.pathname = `/${slug}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Everything else (localhost dev, Vercel preview URLs) passes through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
