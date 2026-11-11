"use client";

/**
 * Central GSAP setup. Import gsap / plugins from here only, so plugins are
 * registered exactly once and defaults stay consistent across the site.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  // Mobile URL-bar show/hide must not trigger full refreshes (layout jumps).
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Breakpoint conditions shared by every gsap.matchMedia() call. */
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export const EASE = {
  out: "expo.out",
  soft: "power3.out",
  inOut: "power3.inOut",
  cinematic: "power4.inOut",
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(MQ.reduced).matches;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
