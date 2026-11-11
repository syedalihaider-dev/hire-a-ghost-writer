/**
 * Single source of truth for all business information.
 * Every value here was taken from the live site (hireaghostwriternow.com).
 * Change a value once here and it updates across the whole homepage.
 *
 * Values flagged `VERIFY` look like CMS template leftovers on the live site and
 * should be confirmed by the business before launch.
 */

export type NavItem = { label: string; href: string; children?: NavItem[] };

export type Genre = {
  slug: string;
  label: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type Plan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
};

const phoneDigits = "3325871570";

export const siteConfig = {
  brand: {
    name: "Hire A Ghost Writer Now",
    legalName: "Hire a Ghost Writer Now",
    url: "https://hireaghostwriternow.com",
    tagline: "Professional Writers for Hire",
    footerTagline: "Elevating your manuscript to global standards.",
    logo: {
      default: { src: "/images/brand/logo-header.png", width: 758, height: 199 },
      reversed: { src: "/images/brand/logo-header-reversed.png", width: 758, height: 199 },
      badge: { src: "/images/brand/logo-footer.png", width: 500, height: 500 },
    },
  },

  contact: {
    phone: {
      display: "(332) 587-1570",
      href: `tel:+1${phoneDigits}`,
      e164: `+1${phoneDigits}`,
    },
    // The live site only had a template placeholder address; per client, no email is shown.
    address: {
      street: "5301 Alpha Rd Ste 80-21",
      city: "Dallas",
      region: "TX",
      postalCode: "75240",
      country: "US",
      display: "5301 Alpha Rd Ste 80-21 Dallas TX 75240",
    },
  },

  // The live site's social icons all point to "#". Add real profile URLs here;
  // the footer only renders the block when at least one entry exists.
  social: [] as { label: string; href: string }[],

  cta: {
    quote: { label: "Get A Quote" },
    call: { label: "Call Us" },
    contact: { label: "Contact Us", href: "/contact-us/" },
    consult: { label: "Consult with an Expert" },
    selectPlan: { label: "Select Plan" },
  },

  navigation: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us/" },
    {
      label: "Services",
      href: "/services/",
      children: [
        { label: "Fiction Ghostwriting", href: "/fiction-ghostwriting-services/" },
        { label: "Non-Fiction Ghostwriting", href: "/non-fiction-ghostwriting-services/" },
        { label: "Memoir Ghostwriting", href: "/memoir-ghostwriting-services/" },
        { label: "Autobiography Ghostwriting", href: "/autobiography-ghostwriting-services/" },
        { label: "Business Ghostwriting", href: "/business-ghostwriting-services/" },
        { label: "Medical Ghostwriting", href: "/medical-ghostwriting-services/" },
        { label: "Children Book Writing", href: "/children-book-writing-services/" },
        { label: "Legal Ghostwriting", href: "/legal-ghostwriting-services/" },
        { label: "Script Writing", href: "/script-writing-services/" },
        { label: "Academic Ghostwriting", href: "/academic-ghostwriting-services/" },
      ],
    },
    { label: "Blogs", href: "/blogs/" },
    { label: "Contact Us", href: "/contact-us/" },
  ] satisfies NavItem[],

  footer: {
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us/" },
      { label: "Services", href: "/services/" },
      { label: "Blogs", href: "/blogs/" },
      { label: "Contact", href: "/contact-us/" },
      { label: "FAQ", href: "/faq/" },
    ],
    legal: [
      { label: "Terms & Conditions", href: "/terms-and-conditions/" },
      { label: "Privacy Policy", href: "/privacy-policy/" },
    ],
    confidentiality: "Your information is kept strictly confidential & protected by NDA.",
  },

  seo: {
    title: "Hire a Ghost Writer Now | Professional Writers for Hire",
    description:
      "Need help writing your book or content? Hire a Ghost Writer Now provides expert ghostwriting services tailored to your voice, ideas, and goals.",
    ogImage: { src: "/images/genres/academic.jpg", width: 500, height: 750 },
    googleSiteVerification: "FkW8OT7OD9O8PsI0Q2JwioHD_SgUo8GyF92UvPCm5Fs",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Services — the ten writing categories (used by Genres + nav + JSON-LD) */
/* ------------------------------------------------------------------ */

export const genres: Genre[] = [
  {
    slug: "fiction",
    label: "Fiction",
    title: "Fiction Writing Services",
    description:
      "We help you build strong characters, clear plotlines, and consistent pacing. Your ideas are shaped into a complete story that flows naturally. We focus on structure, dialogue, and readability. Each chapter connects smoothly to the next. The final manuscript feels engaging and complete.",
    href: "/fiction-ghostwriting-services/",
    image: "/images/genres/fiction.png",
    imageAlt: "A published poetry book resting on a wooden bedside table",
  },
  {
    slug: "non-fiction",
    label: "Non-Fiction",
    title: "Non Fiction Ghostwriting Services",
    description:
      "We organize your ideas into clear, structured content that informs and guides readers. Your message stays focused and easy to follow. We ensure logical flow from start to finish. Complex ideas are simplified without losing meaning. The result is a polished and professional book.",
    href: "/non-fiction-ghostwriting-services/",
    image: "/images/genres/non-fiction.jpg",
    imageAlt: "A stack of business and non-fiction books",
  },
  {
    slug: "memoir",
    label: "Memoir",
    title: "Memoir Ghostwriting",
    description:
      "We focus on specific experiences and moments that matter most. Your story is shaped with clarity and structure. We maintain a consistent tone throughout. Each section supports your main narrative. The final result is meaningful and well-written.",
    href: "/memoir-ghostwriting-services/",
    image: "/images/genres/memoir.jpg",
    imageAlt: "Antique leather-bound books on a shelf",
  },
  {
    slug: "autobiography",
    label: "Autobiography",
    title: "Autobiography Ghostwriting",
    description:
      "We help you present your life story in a clear and structured way. Your voice remains consistent throughout the book. Events are organized for smooth flow. Each chapter connects naturally. The final manuscript feels personal and complete.",
    href: "/autobiography-ghostwriting-services/",
    image: "/images/genres/autobiography.jpg",
    imageAlt: "A bestselling non-fiction hardcover on a yellow background",
  },
  {
    slug: "business",
    label: "Business",
    title: "Business Ghostwriting Services",
    description:
      "We turn your ideas into structured business content. Your message is presented clearly and professionally. We focus on organization, tone, and consistency. Each section supports your main objective. The final result is clear and well-written.",
    href: "/business-ghostwriting-services/",
    image: "/images/genres/business.jpg",
    imageAlt: "A professional in a suit buttoning his jacket",
  },
  {
    slug: "medical",
    label: "Medical",
    title: "Medical Ghostwriting",
    description:
      "We present technical content in a clear and accurate format. Complex topics are simplified for readability without losing precision. We maintain consistency in tone and structure. Each section is organized for easy understanding. The final work remains professional and credible.",
    href: "/medical-ghostwriting-services/",
    image: "/images/genres/medical.png",
    imageAlt: "A published book resting on a wooden bedside table",
  },
  {
    slug: "childrens-book",
    label: "Children's Book",
    title: "Children Book Writing",
    description:
      "We create simple and engaging content for young readers. The language remains clear and age-appropriate. Stories are structured to hold attention. Each page supports the overall message. The final book is easy to read and enjoyable.",
    href: "/children-book-writing-services/",
    image: "/images/genres/non-fiction.jpg",
    imageAlt: "A stack of colourful books",
  },
  {
    slug: "legal",
    label: "Legal",
    title: "Legal Ghostwriting",
    description:
      "We structure legal content with clarity and accuracy. Technical language is refined for better readability. Each section follows a logical and consistent flow. We ensure the content remains precise and well-organized. The final document is clear and professionally written.",
    href: "/legal-ghostwriting-services/",
    image: "/images/genres/legal.jpg",
    imageAlt: "A fountain pen resting on a notepad beside reading glasses",
  },
  {
    slug: "script-writing",
    label: "Script Writing",
    title: "Script Writing",
    description:
      "We develop scripts with clear structure and natural dialogue. Scenes are organized to maintain flow and engagement. Each element supports the overall narrative. We focus on pacing and readability. The final script is structured and easy to follow.",
    href: "/script-writing-services/",
    image: "/images/genres/script-writing.jpg",
    imageAlt: "A film clapperboard held up on set",
  },
  {
    slug: "academic",
    label: "Academic",
    title: "Academic Ghostwriting Services",
    description:
      "We organize research-based content into a clear format. Ideas are structured logically for easy reading. We maintain consistency and clarity throughout. Each section follows a defined purpose. The final document is accurate and properly structured.",
    href: "/academic-ghostwriting-services/",
    image: "/images/genres/academic.jpg",
    imageAlt: "A quiet study room with a desk and guitar by the window",
  },
];

/* ------------------------------------------------------------------ */
/* Supporting services (no dedicated URLs on the live site)            */
/* ------------------------------------------------------------------ */

export type ServicePose = "write" | "edit" | "format" | "publish" | "market" | "website" | "cover" | "illustrate";

export type Service = {
  title: string;
  description: string;
  icon: string;
  image: string;
  imageAlt: string;
  /** object-position — art-directed so the subject stays in frame */
  focal: string;
  pose: ServicePose;
  /** Tags taken only from real site copy. Anything still missing is marked [PLACEHOLDER]. */
  included: string[];
};

export const PLACEHOLDER_TAG = "[PLACEHOLDER: included items]";

export const supportingServices: Service[] = [
  {
    title: "Ghostwriting Services",
    description: "Hire a ghost writer who turns your ideas into a clear, complete manuscript.",
    icon: "/images/icons/creative.png",
    image: "/images/editorial/library-classic-books.jpg",
    imageAlt: "Classic leather-bound books on a library shelf",
    focal: "50% 55%",
    pose: "write",
    // The ten genres from the live homepage
    included: ["Fiction", "Non-Fiction", "Memoir", "Autobiography", "Business", "Medical", "Children's Book", "Legal", "Script Writing", "Academic"],
  },
  {
    title: "Book Editing Services",
    description: "Professional editing improves structure, clarity, and flow for a polished final manuscript.",
    icon: "/images/icons/pen-tip.png",
    image: "/images/editorial/notes-fountain-pen.jpg",
    imageAlt: "A fountain pen resting on an open notebook beside reading glasses",
    focal: "55% 60%",
    pose: "edit",
    // From the FAQ: "improve clarity and flow … refining language and structure"
    included: ["Clarity & Flow", "Language Refinement", "Structure"],
  },
  {
    title: "Book Formatting Services",
    description: "Book formatting services prepare your manuscript for clean layout and publishing requirements.",
    icon: "/images/icons/script.png",
    image: "/images/editorial/typeset-book-stack.jpg",
    imageAlt: "A stack of professionally typeset books",
    focal: "45% 50%",
    pose: "format",
    // From "Comprehensive Interior Design Solutions"
    included: ["eBook (Reflowable)", "Print-on-Demand", "Complex Layouts", "Fixed Layout"],
  },
  {
    title: "Book Publishing Services",
    description: "Book publishing services guide you through the process of making your book available to readers.",
    icon: "/images/icons/literature.png",
    image: "/images/editorial/published-hardcover.jpg",
    imageAlt: "A published hardcover book",
    focal: "50% 50%",
    pose: "publish",
    // From the credential strip + FAQ ("preparing files and meeting platform requirements")
    included: ["KDP Ready", "Ingram Spark", "File Preparation", "Platform Requirements"],
  },
  {
    title: "Book Marketing Services",
    description: "Book marketing services help position your book to reach the right audience effectively.",
    icon: "/images/icons/review.png",
    image: "/images/editorial/professional-author.jpg",
    imageAlt: "A professional author in a tailored suit",
    focal: "50% 30%",
    pose: "market",
    included: ["Bestseller Strategy", PLACEHOLDER_TAG],
  },
  {
    title: "Author Website Services",
    description: "Author website services help you build a professional online presence to showcase your book.",
    icon: "/images/icons/blogger.png",
    image: "/images/editorial/writing-desk-laptop.jpg",
    imageAlt: "A writing desk with a laptop, coffee and handwritten notes",
    focal: "60% 50%",
    pose: "website",
    included: [PLACEHOLDER_TAG],
  },
  {
    title: "Book Cover Design Services",
    description: "Book cover design services create visually strong covers that attract and engage readers.",
    icon: "/images/icons/book-cover.png",
    image: "/images/editorial/bestseller-cover.jpg",
    imageAlt: "A striking black book cover on a wooden table",
    focal: "50% 45%",
    pose: "cover",
    included: [PLACEHOLDER_TAG],
  },
  {
    title: "Book Illustration Services",
    description: "Book illustration services add visual elements that enhance storytelling and reader experience.",
    icon: "/images/icons/book.png",
    image: "/images/editorial/creative-studio.jpg",
    imageAlt: "A sunlit creative studio with instruments and books",
    focal: "40% 55%",
    pose: "illustrate",
    included: [PLACEHOLDER_TAG],
  },
];

/* Stats band — real figures derived from site content; unknowns are placeholders. */
export const stats: { value: number | null; suffix?: string; label: string; placeholder?: string }[] = [
  { value: 10, label: "Genres covered" },
  { value: 8, label: "Publishing services" },
  { value: 4, label: "Step method" },
  { value: null, label: "Books delivered", placeholder: "[PLACEHOLDER: books delivered]" },
];

/* "Complete Writing and Publishing Support" link index (live homepage) */
export const serviceIndex: { label: string; href: string | null }[] = [
  { label: "Fiction Writing Services", href: "/fiction-ghostwriting-services/" },
  { label: "Non-fiction Ghostwriting Services", href: "/non-fiction-ghostwriting-services/" },
  { label: "Medical Ghostwriting", href: "/medical-ghostwriting-services/" },
  { label: "Legal Ghostwriting", href: "/legal-ghostwriting-services/" },
  { label: "Script Writing", href: "/script-writing-services/" },
  { label: "Business Ghostwriting Services", href: "/business-ghostwriting-services/" },
  { label: "Academic Ghostwriting Services", href: "/academic-ghostwriting-services/" },
  { label: "Children's Book Writing", href: "/children-book-writing-services/" },
  { label: "Autobiography Ghostwriting", href: "/autobiography-ghostwriting-services/" },
  { label: "Memoir Ghostwriting", href: "/memoir-ghostwriting-services/" },
  // Live site links this to "#" — no page exists yet.
  { label: "Novel Ghostwriting", href: null },
];

/* ------------------------------------------------------------------ */
/* Pricing — prices exactly as published. Feature lines on the live    */
/* site contain obvious typos; corrected wording is used here (VERIFY). */
/* ------------------------------------------------------------------ */

export const pricing: { eyebrow: string; title: string; plans: Plan[] } = {
  eyebrow: "Investment",
  title: "Packages",
  plans: [
    {
      name: "Basic",
      price: "$10.90",
      period: "per month",
      features: [
        "Kindle & EPUB Layout",
        "Interactive Table of Contents",
        "Premium Image Formatting",
        "Standard Typographic Check",
      ],
    },
    {
      name: "Startup",
      price: "$79.90",
      period: "per month",
      featured: true,
      features: [
        "Everything in Basic",
        "Print-Ready PDF Layout",
        "Custom Chapter Headings",
        "Priority Support & Fast Delivery",
      ],
    },
    {
      name: "Enterprise",
      price: "$400.90",
      period: "per month",
      features: [
        "Full Bundle (Ebook + Print + Hardcover)",
        "Premium Image Formatting",
        "Dust Jacket & Casebound Layout",
        "Priority Support & Fast Delivery",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Forms — field definitions mirror the live Elementor forms           */
/* ------------------------------------------------------------------ */

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder: string;
  required: boolean;
  autoComplete?: string;
};

export const forms = {
  // Hero form + "Get a Free Quote" panel on the live site
  quote: {
    id: "quote",
    submitLabel: "Send My Quote Request",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "Full Name", required: false, autoComplete: "name" },
      { name: "email", label: "Email Address", type: "email", placeholder: "Email Address", required: true, autoComplete: "email" },
      { name: "genre", label: "Genre", type: "text", placeholder: "Select Genre", required: true },
      { name: "wordCount", label: "Word Count", type: "text", placeholder: "Word Count", required: true },
      { name: "message", label: "Your Story Idea", type: "textarea", placeholder: "Tell us briefly about your story idea...", required: false },
    ] as FormField[],
  },
  // "Ready to tell your tale?" closing form on the live site
  project: {
    id: "project",
    submitLabel: "Submit My Request",
    fields: [
      { name: "name", label: "Full Name", type: "text", placeholder: "e.g. John Doe", required: false, autoComplete: "name" },
      { name: "phone", label: "Phone No", type: "tel", placeholder: "+1 (000) 000-0000", required: false, autoComplete: "tel" },
      { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com", required: true, autoComplete: "email" },
      { name: "message", label: "Your Project Details", type: "textarea", placeholder: "Tell us about your story, genre, and word count goals...", required: false },
    ] as FormField[],
  },
};

export type SiteConfig = typeof siteConfig;
