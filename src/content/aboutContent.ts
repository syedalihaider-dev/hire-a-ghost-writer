/**
 * About Us page — copy and image slots.
 *
 * Copy is written for the redesign but every factual claim comes from the
 * live site (services, the 4-step method, commitments, FAQ answers and the
 * homepage testimonials). No statistics, awards, team sizes or years are
 * stated, because none are published.
 *
 * IMAGE SLOTS — replace `src` (and `width`/`height`) with your own artwork.
 * Each frame keeps its designed proportion (`ratio`); `position` is the focal
 * point kept in view, and `fit: "contain"` shows the whole image uncropped.
 */
import { siteConfig } from "./siteConfig";

export type ImageSlot = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** object-position (focal point), e.g. "50% 40%" */
  position?: string;
  /** "cover" (default) fills the frame; "contain" never crops */
  fit?: "cover" | "contain";
};

const PAGE = "/about-us/";

export const aboutSeo = {
  path: PAGE,
  title: "About Hire A Ghost Writer Now | Professional Ghostwriting Studio",
  description:
    "Meet the professional ghostwriters behind Hire A Ghost Writer Now — turning ideas, memories, and expertise into memoirs, autobiographies, and books in your voice.",
  ogImage: { src: "/images/editorial/hero-pen-manuscript.jpg", width: 2000, height: 1502, alt: "A fountain pen writing a manuscript by hand" },
};

/* ---------------- Frontispiece (hero) ---------------- */
export const aboutHero = {
  eyebrow: "About Hire A Ghost Writer Now",
  // RichTitle markup: ~light~  *serif*  trailing "." in gold
  title: "~The Art of~ Giving Stories *a* Voice.",
  intro:
    "We are a ghostwriting studio for people with something worth saying — a life lived, a business built, a world imagined. You bring the story. We shape it into a book that sounds unmistakably like you.",
  secondary: { label: "Explore our craft", href: "#craft" },
  image: {
    src: "/images/editorial/hero-pen-manuscript.jpg",
    alt: "A fountain pen writing a manuscript by hand on lined paper",
    width: 2000,
    height: 1502,
    position: "38% 50%",
  } satisfies ImageSlot,
  caption: "Fig. 1 — Where every manuscript begins",
  // The typeset leaf laid over the photograph — illustrative manuscript text.
  manuscript: {
    chapter: "Chapter One",
    lines: [
      "It began with a voice memo, a box",
      "of old notes, and a story no one",
      "else could tell. The words were",
      "already there — waiting for someone",
      "to listen closely enough to find",
      "their order, their rhythm, their",
      "voice.",
    ],
    notes: [
      { text: "keep — this is you" },
      { text: "your voice" },
    ],
  },
  scrollCue: "Chapter I — Who we are",
};

/* ---------------- Chapter I — Who we are ---------------- */
export const aboutStory = {
  chapter: "Chapter I",
  label: "Who We Are",
  statement:
    "Everyone carries a book. Some live in memories, some in hard-won expertise, some in worlds no one has visited yet. Our work is to bring them onto the page.",
  title: "Turning Ideas, Memories, and Knowledge into Finished Books",
  paragraphs: [
    "Hire A Ghost Writer Now is a team of professional ghostwriters and editors who help people turn what they know — and what they have lived — into complete, professionally written books.",
    "Some clients arrive with a full draft. Many arrive with notes, voice recordings, or a single idea they have carried for years. Either way, we begin by listening: to your goals, to your readers, and to the way you naturally speak. The manuscript is built from there, chapter by chapter.",
    "We write fiction and non-fiction, memoirs and autobiographies, business, medical, legal and academic books, children's stories and scripts. Whatever the genre, the promise is the same — the finished book carries your name and reads like you.",
  ],
  pullQuote: "We don't replace your voice. We give it room.",
  image: {
    src: "/images/editorial/library-classic-books.jpg",
    alt: "Classic leather-bound books on a library shelf",
    width: 2000,
    height: 1333,
    position: "50% 55%",
  } satisfies ImageSlot,
  caption: "Fig. 2 — The archive every author joins",
  secondImage: {
    src: "/images/editorial/notes-fountain-pen.jpg",
    alt: "A fountain pen resting on an open notebook beside reading glasses",
    width: 2000,
    height: 1333,
    position: "55% 60%",
  } satisfies ImageSlot,
};

/* ---------------- Chapter II — Philosophy ---------------- */
export const aboutPhilosophy = {
  chapter: "Chapter II",
  label: "Our Philosophy",
  title: "Every Story ~Deserves~ a Voice.",
  tenets: [
    { numeral: "I", title: "Every story has a purpose.", text: "Before a word is written, we ask why this book needs to exist — to preserve a legacy, share expertise, or simply entertain. Purpose shapes every chapter that follows." },
    { numeral: "II", title: "Every author has a voice.", text: "Your rhythm, your humour, the words you reach for. We study how you speak and write so the finished manuscript reads as yours — never as ours." },
    { numeral: "III", title: "Every manuscript deserves attention.", text: "Structure, pacing, clarity and flow. Each draft is treated with the care of a book that will be read, re-read and remembered." },
    { numeral: "IV", title: "Great writing begins with listening.", text: "The best books start with understanding the person behind them. That is why our process opens with a conversation, not a template." },
  ],
  image: {
    src: "/images/editorial/writing-desk-laptop.jpg",
    alt: "A writing desk with a laptop, coffee and handwritten notes",
    width: 2000,
    height: 1333,
    position: "60% 50%",
  } satisfies ImageSlot,
};

/* ---------------- Chapter III — The craft ---------------- */
export const aboutCraft = {
  chapter: "Chapter III",
  label: "Our Expertise",
  title: "The Craft ~Behind~ Every Book.",
  intro: "Ten genres, one standard of care. Every project is matched with a writer who understands its subject and its readers.",
  linkLabel: "Explore",
  allServices: { label: "View all services", href: "/services/" },
};

/* ---------------- Chapter IV — The process ---------------- */
export const aboutProcess = {
  chapter: "Chapter IV",
  label: "The Writing Process",
  title: "From Idea ~to~ Manuscript.",
  intro: "A clear path from first conversation to finished book — you always know what stage your manuscript is in.",
  stages: [
    { key: "discover", name: "Discover", title: "Share your idea", text: "Send whatever you have — notes, drafts, or voice recordings. We learn your vision, your goals, and exactly who the book is for." },
    { key: "develop", name: "Develop", title: "Define the direction", text: "Together we align tone, structure and direction, then expand your ideas into a clear outline so every chapter earns its place." },
    { key: "create", name: "Create", title: "Write the manuscript", text: "Your writer drafts the book in your voice. You review the initial chapters and approve the direction before the full manuscript takes shape." },
    { key: "refine", name: "Refine", title: "Edit and polish", text: "Request changes as you read — revisions are included. Editing then refines language, clarity and flow until every page reads smoothly." },
    { key: "deliver", name: "Deliver", title: "Ready for the world", text: "You receive a complete, polished, publish-ready manuscript, with formatting and publishing support for KDP and IngramSpark when you need it." },
  ],
};

/* ---------------- Chapter V — What makes us different ---------------- */
export const aboutDifference = {
  chapter: "Chapter V",
  label: "What Makes Us Different",
  statement: "Your Name on the Cover. *Our Craft* Between the Lines.",
  yoursLabel: "What stays yours",
  oursLabel: "What we bring",
  yours: [
    { title: "Your voice", text: "We write from your tone, input and feedback, so the book sounds like you from the first page to the last." },
    { title: "Your story", text: "Every manuscript is written from scratch — 100% original, built entirely from your ideas." },
    { title: "Your name", text: "The book is published as yours. Your ownership stays fully protected." },
    { title: "Your privacy", text: "Your work, identity and content remain confidential, protected by NDA." },
  ],
  ours: [
    { title: "The right writer", text: "Your project is matched with a writer who understands your subject and your audience." },
    { title: "Structure and craft", text: "Pacing, clarity and flow, shaped with care so each chapter connects to the next." },
    { title: "Revisions until it's right", text: "Unlimited revisions are included until the manuscript meets your expectations." },
    { title: "Steady progress", text: "Clear timelines, consistent communication and dedicated support at every stage." },
  ],
};

/* ---------------- Chapter VI — Trust ---------------- */
export const aboutTrust = {
  chapter: "Chapter VI",
  label: "In Their Words",
  title: "Stories ~From~ Our Authors.",
  assurances: ["NDA Protected", "100% Original Writing", "Unlimited Revisions", "KDP & IngramSpark Ready"],
  /**
   * Third-party rating. The old About page showed "4.8 · 275+ reviews on
   * Trustpilot" without a verifiable link, so it is OFF. To show it, set the
   * real figures and the public profile URL that confirms them.
   */
  rating: null as null | { score: string; count: string; source: string; href: string },
  image: {
    src: "/images/editorial/published-hardcover.jpg",
    alt: "A published hardcover book",
    width: 2000,
    height: 1273,
    position: "50% 50%",
  } satisfies ImageSlot,
};

/* ---------------- Epilogue — final CTA ---------------- */
export const aboutCta = {
  label: "Epilogue",
  title: "Your Story Deserves *to Be* Told.",
  text: "Every book begins with a single conversation. Share your idea — however rough, however early — and we'll show you the path from first thought to finished manuscript.",
  page: {
    chapter: "Chapter One",
    // Written onto the blank page as the reader scrolls (starts with the drop cap "Y").
    story:
      "Years from now, someone you love will open this book and meet you here — the kitchen table where it began, the chances you took, the people who changed you, and every lesson you paid for in full. It starts with one honest sentence, then another, until the whole of it is finally on the page.",
    prompt: "Your story starts here.",
  },
  contact: { label: "Contact us", href: siteConfig.cta.contact.href },
  image: {
    src: "/images/editorial/typeset-book-stack.jpg",
    alt: "",
    width: 2000,
    height: 1293,
    position: "50% 60%",
  } satisfies ImageSlot,
};
