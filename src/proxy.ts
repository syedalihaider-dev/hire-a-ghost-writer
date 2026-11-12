import { NextResponse, type NextRequest } from "next/server";
import { SERVICE_SLUGS } from "@/content/servicePages/slugs";

/*
 * Real 404s for unknown root URLs.
 *
 * Inner service pages live on one dynamic root segment (app/[service]). With
 * Cache Components, an unknown param is served from the prerendered shell, so
 * its notFound() arrives after a 200 status — a "soft 404". This runs before
 * rendering: any single-segment path that is neither a static page nor a known
 * service is rewritten to an unrouted path, which Next answers with a genuine
 * 404 (and the normal not-found page). Known pages are untouched.
 */
const STATIC_PAGES = new Set(["about-us", "services", "contact-us"]);
const SERVICES = new Set<string>(SERVICE_SLUGS);

export function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  if (segments.length === 1 && !STATIC_PAGES.has(segments[0]) && !SERVICES.has(segments[0])) {
    return NextResponse.rewrite(new URL("/_unrouted/not-found/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // pages only — never assets, Next internals, the API or files with an extension
  matcher: ["/((?!_next/|api/|images/|.*\\.[a-zA-Z0-9]+$).*)"],
};
