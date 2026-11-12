/**
 * Routes that exist in this Next.js app. Links to anything else (internal
 * pages still served by the old site / not yet rebuilt) skip prefetching so
 * they don't generate 404 prefetch requests. Add each page here as it ships.
 */
export const builtRoutes = new Set<string>(["/", "/about-us/", "/services/"]);
