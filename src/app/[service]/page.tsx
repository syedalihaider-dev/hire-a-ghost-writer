import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/content/siteConfig";
import { getServicePage, servicePageSlugs } from "@/content/servicePages";
import ServicePageTemplate from "@/components/ServicePage/ServicePageTemplate";

/*
 * ONE route for every inner service page, at its existing URL
 * (/fiction-ghostwriting-services/, /memoir-ghostwriting-services/, …).
 * Static routes (/about-us/, /services/, /contact-us/) take precedence over
 * this segment. All service slugs are prerendered; anything else is a 404.
 * (dynamicParams is unavailable with Cache Components, hence notFound().)
 */
type Props = { params: Promise<{ service: string }> };

export function generateStaticParams() {
  return servicePageSlugs.map((service) => ({ service }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const page = getServicePage(service);
  if (!page) return {};
  const { seo } = page;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: page.href },
    // Indexing: inner service pages stay noindex, nofollow for now.
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: page.href,
      siteName: siteConfig.brand.name,
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage.src, alt: seo.ogImage.alt }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [seo.ogImage.src] },
  };
}

export default async function ServiceRoute({ params }: Props) {
  const { service } = await params;
  const page = getServicePage(service);
  if (!page) notFound();

  const { brand } = siteConfig;
  const url = `${brand.url}${page.href}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.name,
        serviceType: page.name,
        url,
        description: page.seo.description,
        provider: { "@id": `${brand.url}/#organization` },
        areaServed: "Worldwide",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${brand.url}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${brand.url}/services/` },
          { "@type": "ListItem", position: 3, name: page.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ServicePageTemplate page={page} />
    </>
  );
}
