import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAINS = new Set([
  "localhost:3000",
  "groomy.com.ar",
  "www.groomy.com.ar",
]);
const APP_SUBDOMAIN = "app";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Skip root domains, known subdomains (app, www)
  if (
    ROOT_DOMAINS.has(host) ||
    host.startsWith(`${APP_SUBDOMAIN}.`)
  ) {
    return NextResponse.next();
  }

  // Extract subdomain: slug.groomy.com.ar → slug
  const parts = host.split(".");
  // Need at least 3: slug + domain + tld
  if (parts.length >= 3 && parts[0] !== "www") {
    const slug = encodeURIComponent(parts[0]);
    const url = request.nextUrl.clone();
    url.pathname = `/${slug}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
