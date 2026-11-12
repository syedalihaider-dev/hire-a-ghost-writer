import type { Metadata } from "next";
import { siteConfig } from "@/content/siteConfig";
import { contactSeo } from "@/content/contactContent";
import ContactHero from "@/components/Contact/ContactHero";
import ContactLetter from "@/components/Contact/ContactLetter";
import ContactDetails from "@/components/Contact/ContactDetails";
import ContactClosing from "@/components/Contact/ContactClosing";
import ContactMotion from "@/components/Contact/ContactMotion";
import ScrollEffects from "@/components/Animation/ScrollEffects";

const { brand, contact } = siteConfig;

/* Indexing: Contact stays noindex, nofollow for now (only /about-us/ is indexable). */
export const metadata: Metadata = {
  title: contactSeo.title,
  description: contactSeo.description,
  alternates: { canonical: contactSeo.path },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: contactSeo.path,
    siteName: brand.name,
    title: contactSeo.title,
    description: contactSeo.description,
  },
  twitter: { card: "summary_large_image", title: contactSeo.title, description: contactSeo.description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${brand.url}${contactSeo.path}`,
  name: contactSeo.title,
  mainEntity: {
    "@type": "Organization",
    "@id": `${brand.url}/#organization`,
    name: brand.name,
    telephone: contact.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ContactHero />
      <ContactLetter />
      <ContactDetails />
      <ContactClosing />
      <ContactMotion />
      <ScrollEffects />
    </>
  );
}
