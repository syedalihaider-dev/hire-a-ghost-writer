/**
 * The inner service page URLs (one template renders them all). Kept in its
 * own tiny module so client code (AppLink → routes) never bundles the copy.
 * Must match the keys of liveServiceContent in ./live.ts.
 */
export const SERVICE_SLUGS = [
  "fiction-ghostwriting-services",
  "non-fiction-ghostwriting-services",
  "memoir-ghostwriting-services",
  "autobiography-ghostwriting-services",
  "business-ghostwriting-services",
  "medical-ghostwriting-services",
  "children-book-writing-services",
  "legal-ghostwriting-services",
  "academic-ghostwriting-services",
  "script-writing-services",
] as const;
