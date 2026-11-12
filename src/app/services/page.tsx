import type { Metadata } from "next";
import { siteConfig } from "@/content/siteConfig";
import { catalogue, servicesSeo, SHOW_SERVICES_PRICING } from "@/content/servicesContent";
import ServicesHero from "@/components/Services/ServicesHero";
import Catalogue from "@/components/Services/Catalogue";
import Craft from "@/components/Services/Craft";
import Interlude from "@/components/Services/Interlude";
import Voices from "@/components/Services/Voices";
import Terms from "@/components/Services/Terms";
import Journey from "@/components/Services/Journey";
import Stories from "@/components/Services/Stories";
import ServicesFaq from "@/components/Services/ServicesFaq";
import Finale from "@/components/Services/Finale";
import ServicesMotion from "@/components/Services/ServicesMotion";
import ScrollEffects from "@/components/Animation/ScrollEffects";
// Pricing is kept but hidden — flip SHOW_SERVICES_PRICING in content/servicesContent.ts.
import Pricing from "@/components/Home/Pricing/Pricing";

const { brand } = siteConfig;

/*
 * Indexing: this route stays noindex, nofollow for now (only /about-us/ is
 * indexable). Stated explicitly here, not just inherited from the layout.
 */
export const metadata: Metadata = {
  title: servicesSeo.title,
  description: servicesSeo.description,
  alternates: { canonical: servicesSeo.path },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: servicesSeo.path,
    siteName: brand.name,
    title: servicesSeo.title,
    description: servicesSeo.description,
    images: [{ url: servicesSeo.ogImage.src, width: servicesSeo.ogImage.width, height: servicesSeo.ogImage.height, alt: servicesSeo.ogImage.alt }],
  },
  twitter: { card: "summary_large_image", title: servicesSeo.title, description: servicesSeo.description, images: [servicesSeo.ogImage.src] },
};

function jsonLd() {
  const url = `${brand.url}${servicesSeo.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: servicesSeo.title,
        description: servicesSeo.description,
        isPartOf: { "@id": `${brand.url}/#website` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${brand.url}/` },
            { "@type": "ListItem", position: 2, name: "Services", item: url },
          ],
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: catalogue.entries.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "Service", name: e.name, url: `${brand.url}${e.href}`, provider: { "@id": `${brand.url}/#organization` } },
          })),
        },
      },
    ],
  };
}

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }} />
      <ServicesHero />
      <Catalogue />
      <Craft />
      <Interlude />
      <Voices />
      <Terms />
      <Journey />
      <Stories />
      {SHOW_SERVICES_PRICING && <Pricing />}
      <ServicesFaq />
      <Finale />
      <ServicesMotion />
      <ScrollEffects />
    </>
  );
}
