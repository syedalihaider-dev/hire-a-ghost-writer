/**
 * Services page (/services/) — copy and image slots.
 *
 * Wording marked LIVE is taken from hireaghostwriternow.com/services/ (or the
 * live homepage) and kept verbatim where it states business terms
 * (ownership, confidentiality, revisions, delivery). Connective editorial copy
 * is new but makes no new claims.
 *
 * IMAGE SLOTS — replace `src` (+ `width`/`height`) with your own artwork.
 * Frames keep their designed proportion; `position` is the focal point.
 */
import { genres, siteConfig } from "./siteConfig";
import { faq, testimonials as homeTestimonials } from "./homeContent";
import type { ImageSlot } from "./aboutContent";

export type { ImageSlot };

const PATH = "/services/";

export const servicesSeo = {
  path: PATH,
  title: "Ghostwriting Services | Fiction, Memoir & Business Books — Hire A Ghost Writer Now",
  description:
    "Professional ghostwriting services for fiction, non-fiction, memoir, autobiography, business, medical, children's, legal and academic books — written in your voice.",
  ogImage: { src: "/images/editorial/library-classic-books.jpg", width: 2000, height: 1333, alt: "Classic leather-bound books on a library shelf" },
};

/* ---------------- Hero ---------------- */
export const servicesHero = {
  eyebrow: "Ghostwriting Services",
  // RichTitle markup: ~light~  *serif*  trailing "." in gold
  title: "Professional Ghostwriting *that brings* Your Story ~to~ Life.",
  // LIVE hero paragraph
  intro: "Your life story shouldn’t remain limited to memories alone. We turn your experiences into a book that will live on for generations. Preserve your story with professional ghostwriting.",
  primary: "Start Your Story", // LIVE
  secondary: { label: "Browse the catalogue", href: "#catalogue" },
  image: {
    src: "/images/editorial/library-classic-books.jpg",
    alt: "Classic leather-bound books on a library shelf",
    width: 2000,
    height: 1333,
    position: "52% 50%",
  } satisfies ImageSlot,
  inset: {
    src: "/images/editorial/notes-fountain-pen.jpg",
    alt: "A fountain pen resting on an open notebook",
    width: 2000,
    height: 1333,
    position: "55% 60%",
  } satisfies ImageSlot,
  card: { kicker: "Catalogue card", title: "Your Story", rows: [["Author", "You"], ["Written by", "Your ghostwriter"], ["Voice", "Entirely yours"]] },
  note: "Your story is your right; preserve it today.", // LIVE
};

/* ---------------- The catalogue (9 services) ---------------- */
/** Composition per entry — varied on purpose, so the catalogue never reads as a grid. */
export type EntryLayout = "feature" | "feature-rev" | "portrait" | "portrait-rev" | "pair";

const LAYOUTS: EntryLayout[] = ["feature", "portrait", "portrait-rev", "feature-rev", "pair", "pair", "feature", "pair", "pair"];

// The nine services, in the order and with the names used in the site navigation.
// Script Writing has its own page but is not part of this catalogue (as on the live footer).
const ORDER = [
  "/fiction-ghostwriting-services/",
  "/non-fiction-ghostwriting-services/",
  "/memoir-ghostwriting-services/",
  "/autobiography-ghostwriting-services/",
  "/business-ghostwriting-services/",
  "/medical-ghostwriting-services/",
  "/children-book-writing-services/",
  "/legal-ghostwriting-services/",
  "/academic-ghostwriting-services/",
];

const navServices = siteConfig.navigation.find((n) => n.children)?.children ?? [];

export const catalogue = {
  label: "The Catalogue",
  title: "Nine Disciplines. ~One~ Standard ~of~ Craft.",
  intro: "Each service is matched with a writer who understands its subject and its readers. Browse the catalogue — every entry opens onto its own page.",
  cta: "Explore",
  entries: ORDER.map((href, i) => {
    const g = genres.find((x) => x.href === href)!;
    const name = navServices.find((n) => n.href === href)?.label ?? g.title;
    return {
      slug: g.slug,
      name,
      kind: g.label,
      href,
      description: g.description, // LIVE (homepage genre copy)
      layout: LAYOUTS[i],
      image: { src: g.image, alt: g.imageAlt, width: 1600, height: 1200, position: "50% 50%" } satisfies ImageSlot,
    };
  }),
};

/* ---------------- Craft & capabilities ---------------- */
export const craft = {
  label: "The Craft",
  // LIVE: "Why Memory Alone Limits Your Success"
  title: "Why Memory Alone ~Limits~ Your Success.",
  statement: "Memories may fade, but what is written remains alive.", // LIVE
  text: "Without professional help, people often forget important events or fail to present them in the right sequence. We give structure to your memories so that every page of your book leaves a lasting impact on the reader.", // LIVE
  instruments: [
    { key: "interviews", title: "Personal Interviews", text: "We record your sessions so that every moment is preserved." }, // LIVE
    { key: "narrative", title: "Creative Narrative", text: "It’s our expertise to transform your life facts into a compelling story." }, // LIVE
    { key: "voice", title: "Authentic Voice", text: "We write entirely in your voice to ensure authenticity is preserved." }, // LIVE
  ],
  refinementsLabel: "On every page",
  refinements: [
    { title: "Emotional Depth & Tone", text: "We don’t just write words; we manage the pacing of your story. Where emotions matter, we add depth, and where lessons are important, we provide clarity." }, // LIVE
    { title: "Chronological Flow & Structure", text: "A great biography is one that presents the journey from childhood to today in a way that makes the reader feel part of it. We set the timeline with technical precision." }, // LIVE
    // The live text for this heading duplicates the one above; this uses the live FAQ answer on editing instead.
    { title: "Legacy Editing & Final Polish", text: "Editing improves clarity and flow, refining language and structure so your manuscript reads smoothly and is ready for the next stage." },
  ],
  page: {
    src: "/images/editorial/typeset-book-stack.jpg",
    alt: "A stack of professionally typeset books",
    width: 2000,
    height: 1293,
    position: "45% 50%",
  } satisfies ImageSlot,
};

/* ---------------- Interstitial CTA ---------------- */
export const interlude = {
  title: "Start the Next Chapter ~of~ Your Story Today.", // LIVE
  cta: "Book Consultation", // LIVE
};

/* ---------------- Every story has its own voice ---------------- */
export const voices = {
  label: "Range",
  title: "Every Story Has ~Its Own~ Voice.",
  intro: "Different books ask for different writing. Our writers adapt tone, structure and approach to your genre so your story connects clearly with readers.",
  items: [
    { key: "fiction", word: "Fiction", line: "Strong characters, clear plotlines, consistent pacing.", href: "/fiction-ghostwriting-services/" },
    { key: "memoir", word: "Memoir", line: "Specific experiences and the moments that matter most.", href: "/memoir-ghostwriting-services/" },
    { key: "business", word: "Business", line: "Your ideas, structured and presented professionally.", href: "/business-ghostwriting-services/" },
    { key: "medical", word: "Medical & Academic", line: "Complex topics, clear and accurate — without losing precision.", href: "/medical-ghostwriting-services/" },
    { key: "children", word: "Children’s", line: "Simple, engaging and age-appropriate for young readers.", href: "/children-book-writing-services/" },
    { key: "legal", word: "Legal", line: "Precise, well-organized and professionally written.", href: "/legal-ghostwriting-services/" },
  ],
};

/* ---------------- Why choose us ---------------- */
export const terms = {
  label: "Why Choose Us",
  title: "Why Choose Our ~Legacy~ Ghostwriting?", // LIVE
  seal: "Your story · Your voice · Your name · ",
  // Business terms — LIVE wording, unchanged.
  clauses: [
    { title: "Reliable Delivery", text: "We respect deadlines and deliver drafts according to the agreed-upon timeline." },
    { title: "Unlimited Revisions", text: "We keep making revisions until you are completely satisfied with every single sentence." },
    { title: "Full Ownership", text: "All royalties and copyrights will belong to you. Our name will not be mentioned anywhere." },
    { title: "Confidentiality Guarantee", text: "Your conversations with us will remain confidential. We provide 100% legal privacy." },
    { title: "Expert Storytelling", text: "Our writers use literary techniques that make your biography not boring, but truly engaging and thrilling." },
    { title: "Legacy Building", text: "We don’t just write books; we create a path for future generations." },
  ],
};

/* ---------------- The journey ---------------- */
export const journey = {
  label: "The Journey",
  title: "From First Idea ~to~ Final Manuscript.",
  stages: [
    { name: "Discover", title: "Share your story", text: "Bring your idea, notes, drafts or voice recordings. Through personal interviews — recorded so every moment is preserved — we learn your story, your goals and your readers." },
    { name: "Develop", title: "Give it structure", text: "We align tone and direction and give structure to your memories and ideas, setting the timeline so every event appears in the right sequence." },
    { name: "Create", title: "Write in your voice", text: "Your book is written entirely in your voice. You review the initial chapters and approve the direction as the manuscript takes shape." },
    { name: "Refine", title: "Revise and polish", text: "Revisions continue until you are completely satisfied with every sentence, while editing refines clarity, language and flow." },
    { name: "Deliver", title: "Receive your book", text: "Drafts are delivered according to the agreed-upon timeline, ending in a complete, polished manuscript — with all royalties and copyrights belonging to you." },
  ],
};

/* ---------------- Testimonials ---------------- */
export const stories = {
  label: "Success Stories", // LIVE
  title: "In ~Their~ Words.",
  intro: "Our clients’ success is our true identity. Discover what they have to say about us.", // LIVE
  // LIVE services-page testimonials (de-duplicated) followed by the live homepage ones.
  items: [
    { quote: "The way their ghostwriting team transformed my life story is outstanding. Their professionalism and confidentiality are exceptional.", name: "Robert Miller", role: "Bestselling Author" },
    { quote: "Book formatting and the publishing process have never felt this easy before. Their team guides you at every step.", name: "Ayesha Sohail", role: "Entrepreneur" },
    ...homeTestimonials.items.map((t) => ({ quote: t.quote, name: t.name, role: t.service })),
  ],
};

/* ---------------- FAQ ---------------- */
const pick = (q: string) => faq.items.find((i) => i.q === q)!;
export const servicesFaq = {
  label: "FAQ",
  title: "Curiosity ~&~ Answers.", // LIVE heading
  groups: [
    {
      key: "ghostwriting",
      label: "Ghostwriting",
      items: [
        pick("How do I hire a ghost writer?"),
        pick("What if I only have an idea?"),
        pick("Will the book sound like me?"),
        pick("What genres do you cover?"),
        pick("How long do ghostwriting services take?"),
        pick("Can I request revisions?"),
        pick("Is my work kept confidential?"),
      ],
    },
    {
      key: "publishing",
      label: "Formatting & Publishing",
      items: [
        // LIVE services-page FAQs (shown once; the live page repeats them)
        { q: "What is the difference between Reflowable and Fixed Layout?", a: "Reflowable text adjusts to screens (Kindle), while Fixed Layout maintains exact positioning (Children's books)." },
        { q: "Do I need a different file for Amazon KDP and IngramSpark?", a: "Yes, both platforms have specific margin and technical requirements. We provide tailored files for both." },
        { q: "Will my book look the same on Kindle and iPad?", a: "eBooks are adaptable, but professional formatting ensures typography and structure stay consistent and readable." },
        pick("Do you help with editing as well?"),
        pick("Do you help with publishing?"),
      ],
    },
  ],
};

/* ---------------- Plans (hidden) ---------------- */
/**
 * The live page has a "Choose From Exclusive Legacy Plans" block, and the
 * project has a full <Pricing /> component. Both are kept but NOT rendered.
 * Flip to true to show the pricing section on this page again.
 */
export const SHOW_SERVICES_PRICING = false;
export const plansIntro = {
  title: "Choose From Exclusive Legacy Plans", // LIVE
  text: "We have plans for every need, whether it’s a 50-page memoir or a 500-page detailed biography. Our team of expert writers will be with you every step of the way.", // LIVE
  cta: "Consult Now", // LIVE
};

/* ---------------- Final CTA ---------------- */
export const finale = {
  eyebrow: "Stop Dreaming. Let's Start Writing.", // LIVE
  title: "Your Story Deserves ~to~ Become a Book.",
  text: "Begin your legacy now. Fill the form and let’s talk about your journey.", // LIVE ("Begin Your Legacy Now")
  cta: "Get Started Today", // LIVE
  contact: { label: "Contact us", href: siteConfig.cta.contact.href },
  image: {
    src: "/images/editorial/published-hardcover.jpg",
    alt: "",
    width: 2000,
    height: 1273,
    position: "50% 50%",
  } satisfies ImageSlot,
};
