import type { CSSProperties } from "react";
import type { ServicePage } from "@/content/servicePages";
import ServiceHero from "./ServiceHero";
import ServiceStory from "./ServiceStory";
import ServiceExpertise from "./ServiceExpertise";
import ServiceMidCta from "./ServiceMidCta";
import ServiceProcess from "./ServiceProcess";
import ServiceValue from "./ServiceValue";
import ServiceShowcase from "./ServiceShowcase";
import ServiceTestimonials from "./ServiceTestimonials";
import ServiceFaq from "./ServiceFaq";
import ServiceClosing from "./ServiceClosing";
import ServicePageMotion from "./ServicePageMotion";
import ScrollEffects from "@/components/Animation/ScrollEffects";

/**
 * The master inner-service template. Every service page is this component
 * fed a different `ServicePage` object (content/servicePages). The service's
 * palette is exposed as CSS variables (--tone, --glow) so each page carries
 * its own colour inside the shared design.
 *
 * Optional sections render only when their data exists (testimonials,
 * portfolio covers inside the showcase).
 */
export default function ServicePageTemplate({ page }: { page: ServicePage }) {
  return (
    <div style={{ "--tone": page.tone, "--glow": page.glow } as CSSProperties} data-service-page>
      <ServiceHero page={page} />
      <ServiceStory page={page} />
      <ServiceExpertise page={page} />
      <ServiceMidCta page={page} />
      <ServiceProcess page={page} />
      <ServiceValue page={page} />
      <ServiceShowcase page={page} />
      <ServiceTestimonials page={page} />
      <ServiceFaq page={page} />
      <ServiceClosing page={page} />
      <ServicePageMotion />
      <ScrollEffects />
    </div>
  );
}
