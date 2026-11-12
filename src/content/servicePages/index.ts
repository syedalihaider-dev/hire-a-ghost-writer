/**
 * Inner service pages — ONE template, data-driven.
 *
 *  live.ts   the existing copy of every service page (extracted from the live site)
 *  this file the design layer per service: palette, tagline, image slots, SEO,
 *            optional sections — merged into a single typed `ServicePage`.
 *
 * Every page is rendered by app/[service]/page.tsx → components/ServicePage.
 * To add or change a service, edit data here — never the layout.
 *
 * IMAGE SLOTS — replace `src` (+ `width`/`height`) with your own artwork.
 */
import { genres, siteConfig } from "../siteConfig";
import { commitment, faq as siteFaq, portfolio } from "../homeContent";
import type { ImageSlot } from "../aboutContent";
import { liveServiceContent } from "./live";

type LiveSlug = keyof typeof liveServiceContent;

type Design = {
  /** Short editorial line under the headline. */
  tagline: string;
  /** Dark base + highlight used to tint the page (within the brand palette). */
  tone: string;
  glow: string;
  /** Image slots for this service. `hero` is the cover art on the book jacket. */
  images: { hero: ImageSlot; story: ImageSlot; expertise: ImageSlot; closing: ImageSlot };
  /** Show the portfolio covers in the showcase (only where real samples exist). */
  portfolio?: boolean;
};

const img = (src: string, alt: string, width = 2000, height = 1333, position = "50% 50%"): ImageSlot => ({ src, alt, width, height, position });

const E = {
  library: img("/images/editorial/library-classic-books.jpg", "Classic leather-bound books on a library shelf"),
  notes: img("/images/editorial/notes-fountain-pen.jpg", "A fountain pen resting on an open notebook beside reading glasses", 2000, 1333, "55% 60%"),
  desk: img("/images/editorial/writing-desk-laptop.jpg", "A writing desk with a laptop, coffee and handwritten notes", 2000, 1333, "60% 50%"),
  pen: img("/images/editorial/hero-pen-manuscript.jpg", "A fountain pen writing a manuscript by hand", 2000, 1502, "38% 50%"),
  typeset: img("/images/editorial/typeset-book-stack.jpg", "A stack of professionally typeset books", 2000, 1293, "45% 50%"),
  hardcover: img("/images/editorial/published-hardcover.jpg", "A published hardcover book", 2000, 1273),
  studio: img("/images/editorial/creative-studio.jpg", "A sunlit creative studio with books", 2000, 1333, "40% 55%"),
  author: img("/images/editorial/professional-author.jpg", "A professional author in a tailored suit", 2000, 1333, "50% 30%"),
  cover: img("/images/editorial/bestseller-cover.jpg", "A black book cover on a wooden table", 2000, 3000, "50% 45%"),
};

const heroOf = (slug: string) => {
  const g = genres.find((x) => x.href === `/${slug}/`)!;
  return img(g.image, g.imageAlt, 1600, 2000, "50% 50%");
};

const DESIGN: Record<LiveSlug, Design> = {
  "fiction-ghostwriting-services": {
    tagline: "Your story has a world. Let’s give it a voice.",
    tone: "#16232b",
    glow: "#7895a1",
    images: { hero: heroOf("fiction-ghostwriting-services"), story: E.pen, expertise: E.library, closing: E.typeset },
    portfolio: true,
  },
  "non-fiction-ghostwriting-services": {
    tagline: "What you know, built into a book that holds together.",
    tone: "#171d2c",
    glow: "#8a97b0",
    images: { hero: heroOf("non-fiction-ghostwriting-services"), story: E.desk, expertise: E.typeset, closing: E.hardcover },
  },
  "memoir-ghostwriting-services": {
    tagline: "The part of your life that matters, told with focus.",
    tone: "#2b1418",
    glow: "#b07a6a",
    images: { hero: heroOf("memoir-ghostwriting-services"), story: E.notes, expertise: E.pen, closing: E.library },
  },
  "autobiography-ghostwriting-services": {
    tagline: "A whole life, in an order that makes sense.",
    tone: "#251f15",
    glow: "#c5a059",
    images: { hero: heroOf("autobiography-ghostwriting-services"), story: E.library, expertise: E.notes, closing: E.cover },
  },
  "business-ghostwriting-services": {
    tagline: "Your thinking, captured — without stepping away from the business.",
    tone: "#121827",
    glow: "#9aa5b6",
    images: { hero: heroOf("business-ghostwriting-services"), story: E.author, expertise: E.desk, closing: E.typeset },
  },
  "medical-ghostwriting-services": {
    tagline: "Clinical accuracy, written for the people who read it.",
    tone: "#132226",
    glow: "#6fa3a0",
    images: { hero: heroOf("medical-ghostwriting-services"), story: E.desk, expertise: E.notes, closing: E.hardcover },
  },
  "children-book-writing-services": {
    tagline: "Written for how children think, read and listen.",
    tone: "#221b36",
    glow: "#d4b373",
    images: { hero: heroOf("children-book-writing-services"), story: E.studio, expertise: E.cover, closing: E.library },
  },
  "legal-ghostwriting-services": {
    tagline: "Arguments that keep their structure under scrutiny.",
    tone: "#1b1916",
    glow: "#b48e46",
    images: { hero: heroOf("legal-ghostwriting-services"), story: E.notes, expertise: E.typeset, closing: E.author },
  },
  "academic-ghostwriting-services": {
    tagline: "Your research — clear, structured and complete.",
    tone: "#191f31",
    glow: "#8f86b8",
    images: { hero: heroOf("academic-ghostwriting-services"), story: E.library, expertise: E.desk, closing: E.typeset },
  },
  "script-writing-services": {
    tagline: "Words that sound right when they are spoken.",
    tone: "#20171f",
    glow: "#a5543a",
    images: { hero: heroOf("script-writing-services"), story: E.studio, expertise: E.pen, closing: E.hardcover },
  },
};

/** Live general FAQ answers, used where a service page has no FAQs of its own. */
const FALLBACK_FAQ = ["What if I only have an idea?", "Will the book sound like me?", "How long do ghostwriting services take?", "Can I request revisions?", "Is my work kept confidential?"]
  .map((q) => siteFaq.items.find((i) => i.q === q))
  .filter((x): x is { q: string; a: string } => Boolean(x));

/** Site-wide commitments (live homepage copy) for the "value" section. */
const VALUE = commitment.items.filter((c) => ["100% Original Content", "Complete Privacy and Confidentiality", "Unlimited Revisions Included", "Always Delivered on Time"].includes(c.title));

const navServices = siteConfig.navigation.find((n) => n.children)?.children ?? [];

/** Split long live copy: the first sentences open the hero, the rest open the story. */
function splitLead(text: string, sentences = 2) {
  const parts = text.match(/[^.!?]+[.!?]+["”]?\s*/g) ?? [text];
  return { lead: parts.slice(0, sentences).join("").trim(), rest: parts.slice(sentences).join("").trim() };
}

export function getServicePage(slug: string) {
  if (!(slug in liveServiceContent)) return null;
  const key = slug as LiveSlug;
  const live = liveServiceContent[key];
  const design = DESIGN[key];
  const href = `/${slug}/`;
  const genre = genres.find((g) => g.href === href)!;
  const name = navServices.find((n) => n.href === href)?.label ?? genre.title;
  const hero = splitLead(live.hero.text);

  return {
    slug,
    href,
    name,
    kind: genre.label,
    ...design,
    hero: { title: live.hero.title, lead: hero.lead, rest: hero.rest, cta: "Get Free Quote" },
    problem: live.problem,
    expertise: live.expertise,
    midCta: { ...live.midCta, cta: "Get A Quote", call: siteConfig.cta.call.label },
    process: live.process,
    value: { title: "What You Can Count On", items: VALUE },
    showcase: {
      title: live.showcaseTitle,
      portfolio: design.portfolio ? portfolio.items : null,
      related: genres.filter((g) => g.href !== href).map((g) => ({ label: g.title, href: g.href, text: g.description.split(". ")[0] + "." })),
    },
    testimonials: live.testimonials.length ? { title: live.testimonialsTitle, items: live.testimonials } : null,
    faq: { title: "Frequently Asked Questions", items: live.faq.length ? live.faq : FALLBACK_FAQ, isGeneral: !live.faq.length },
    closing: live.closing,
    final: live.final,
    seo: {
      title: `${name} Services | Hire A Ghost Writer Now`,
      description: genre.description.split(". ").slice(0, 2).join(". ").replace(/\.?$/, "."),
      ogImage: design.images.hero,
    },
  };
}

export type ServicePage = NonNullable<ReturnType<typeof getServicePage>>;

export { SERVICE_SLUGS as servicePageSlugs } from "./slugs";

// compile-time guard: every slug has live content and every live page has a slug
type _SlugsMatch = [LiveSlug] extends [(typeof import("./slugs").SERVICE_SLUGS)[number]]
  ? [(typeof import("./slugs").SERVICE_SLUGS)[number]] extends [LiveSlug]
    ? true
    : never
  : never;
export const __slugsMatch: _SlugsMatch = true;
