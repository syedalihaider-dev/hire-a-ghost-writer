import type { Metadata } from "next";
import { faq, SHOW_PRICING } from "@/content/homeContent";
import { genres, pricing, siteConfig } from "@/content/siteConfig";
import Hero from "@/components/Home/Hero/Hero";
import Ribbon from "@/components/Home/Ribbon/Ribbon";
import About from "@/components/Home/About/About";
import Services from "@/components/Home/Services/Services";
import Genres from "@/components/Home/Genres/Genres";
import Showcase from "@/components/Home/Showcase/Showcase";
import Process from "@/components/Home/Process/Process";
// Pricing is temporarily hidden from the homepage (not removed). To restore it,
// uncomment this import and <Pricing /> below, and set SHOW_PRICING to true in content/homeContent.ts.
// import Pricing from "@/components/Home/Pricing/Pricing";
import WhyUs from "@/components/Home/WhyUs/WhyUs";
import StartBand from "@/components/Home/StartBand/StartBand";
import Testimonials from "@/components/Home/Testimonials/Testimonials";
import Insights from "@/components/Home/Insights/Insights";
import FAQ from "@/components/Home/FAQ/FAQ";
import Contact from "@/components/Home/Contact/Contact";
import ScrollEffects from "@/components/Animation/ScrollEffects";

/* Homepage is intentionally noindex, nofollow for now (explicit, not just inherited). */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

function buildJsonLd() {
  const { brand, contact } = siteConfig;
  const org = {
    "@type": "Organization",
    "@id": `${brand.url}/#organization`,
    name: brand.name,
    url: brand.url,
    logo: `${brand.url}${brand.logo.badge.src}`,
    telephone: contact.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      { "@type": "WebSite", "@id": `${brand.url}/#website`, url: brand.url, name: brand.name, publisher: { "@id": org["@id"] } },
      {
        "@type": "Service",
        serviceType: "Ghostwriting",
        provider: { "@id": org["@id"] },
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Ghostwriting Services",
          itemListElement: genres.map((g) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: g.title, url: `${brand.url}${g.href}` } })),
        },
        ...(SHOW_PRICING ? { offers: pricing.plans.map((p) => ({ "@type": "Offer", name: `${p.name} Package`, price: p.price.replace(/[^0-9.]/g, ""), priceCurrency: "USD" })) } : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
      },
    ],
  };
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c") }} />
      <Hero />
      <Ribbon />
      <About />
      <Services />
      <Genres />
      <Showcase />
      <Process />
      {/* <Pricing /> — hidden for now, see the import note above */}
      <WhyUs />
      <StartBand />
      <Testimonials />
      <Insights />
      <FAQ />
      <Contact />
      <ScrollEffects />
    </>
  );
}
