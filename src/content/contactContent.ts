/**
 * Contact page (/contact-us/) — copy and image slots.
 * Lines marked LIVE come from hireaghostwriternow.com/contact-us/ (or the
 * live FAQ). Business details come from siteConfig only; the live site
 * shows no email address (per client), so none is shown here either.
 *
 * IMAGE SLOTS — replace `src` (+ `width`/`height`) with your own artwork.
 */
import { siteConfig } from "./siteConfig";
import type { ImageSlot } from "./aboutContent";

export const contactSeo = {
  path: "/contact-us/",
  title: "Contact Us | Start Your Book — Hire A Ghost Writer Now",
  description:
    "Tell us about your story, memoir, business book or manuscript. Share a few details and our ghostwriters will contact you to discuss your project — confidentially.",
};

export const contactHero = {
  eyebrow: "Contact Us",
  title: "Every Great Story ~Begins~ With a Conversation.",
  kicker: "Stories Built From Your Vision", // LIVE
  text: "Share an idea, a memory, a draft or a manuscript that needs finishing. Whatever stage you are at, our ghostwriters start by listening.",
  primary: { label: "Start the conversation", href: "#letter" },
  image: {
    src: "/images/editorial/writing-desk-laptop.jpg",
    alt: "A writing desk with a laptop, coffee and handwritten notes",
    width: 2000,
    height: 1333,
    position: "60% 50%",
  } satisfies ImageSlot,
  envelope: { to: siteConfig.brand.name, from: "You", note: "About my book…" },
};

export const contactLetter = {
  title: "Begin Your Project Now", // LIVE
  text: "Fill out the form below and share a few details. Our expert ghostwriters will contact you shortly to discuss your project.", // LIVE
  salutation: `Dear ${siteConfig.brand.name},`,
  signoff: "Yours, in good faith",
  // LIVE FAQ: "How do I hire a ghost writer?" — split into its three moves.
  next: {
    label: "What happens next",
    steps: [
      { title: "You share", text: "Start by sharing your idea, notes, or draft." },
      { title: "We review", text: "Our team reviews your input and guides you through the next steps." },
      { title: "You decide", text: "We explain the process clearly so you know what to expect." },
    ],
  },
};

export const contactDetails = {
  label: "Find Us",
  title: "The Studio",
  image: {
    src: "/images/sections/writing-desk-coffee.jpg",
    alt: "Coffee, notepad and pen on a wooden desk",
    width: 520,
    height: 450,
    position: "50% 50%",
  } satisfies ImageSlot,
};

export const contactClosing = {
  title: "Your Story ~Is~ Waiting ~to~ Be Told.",
  text: "Start the journey of your book today.", // LIVE (quote panel)
  cta: "Get a Free Quote", // LIVE
  back: { label: "Write to us", href: "#letter" },
};
