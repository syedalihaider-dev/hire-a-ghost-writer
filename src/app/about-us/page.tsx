import type { Metadata } from "next";
import { siteConfig } from "@/content/siteConfig";
import { aboutSeo } from "@/content/aboutContent";
import AboutHero from "@/components/About/AboutHero";
import AboutStory from "@/components/About/AboutStory";
import AboutPhilosophy from "@/components/About/AboutPhilosophy";
import AboutCraft from "@/components/About/AboutCraft";
import AboutProcess from "@/components/About/AboutProcess";
import AboutDifference from "@/components/About/AboutDifference";
import AboutTrust from "@/components/About/AboutTrust";
import AboutCta from "@/components/About/AboutCta";
import AboutMotion from "@/components/About/AboutMotion";
import ScrollEffects from "@/components/Animation/ScrollEffects";

const { brand } = siteConfig;

/*
 * Indexing: the About page is the ONLY indexable route for now.
 * Metadata merges shallowly, so this `robots` object fully replaces the
 * site-wide noindex default set in app/layout.tsx.
 */
export const metadata: Metadata = {
  title: aboutSeo.title,
  description: aboutSeo.description,
  alternates: { canonical: aboutSeo.path },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: aboutSeo.path,
    siteName: brand.name,
    title: aboutSeo.title,
    description: aboutSeo.description,
    images: [{ url: aboutSeo.ogImage.src, width: aboutSeo.ogImage.width, height: aboutSeo.ogImage.height, alt: aboutSeo.ogImage.alt }],
  },
  twitter: { card: "summary_large_image", title: aboutSeo.title, description: aboutSeo.description, images: [aboutSeo.ogImage.src] },
};

function jsonLd() {
  const url = `${brand.url}${aboutSeo.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url}#webpage`,
        url,
        name: aboutSeo.title,
        description: aboutSeo.description,
        isPartOf: { "@id": `${brand.url}/#website` },
        about: { "@id": `${brand.url}/#organization` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${brand.url}/` },
          { "@type": "ListItem", position: 2, name: "About Us", item: url },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${brand.url}/#organization`,
        name: brand.name,
        url: brand.url,
        logo: `${brand.url}${brand.logo.badge.src}`,
        telephone: siteConfig.contact.phone.e164,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.contact.address.street,
          addressLocality: siteConfig.contact.address.city,
          addressRegion: siteConfig.contact.address.region,
          postalCode: siteConfig.contact.address.postalCode,
          addressCountry: siteConfig.contact.address.country,
        },
      },
    ],
  };
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }} />
      <AboutHero />
      <AboutStory />
      <AboutPhilosophy />
      <AboutCraft />
      <AboutProcess />
      <AboutDifference />
      <AboutTrust />
      <AboutCta />
      <AboutMotion />
      <ScrollEffects />
    </>
  );
}
