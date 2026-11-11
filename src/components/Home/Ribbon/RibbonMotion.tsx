"use client";

import { useEffect } from "react";
import { gsap, MQ } from "@/lib/gsap";

/** Scroll-scrubbed travel for the two ribbon bands (opposite directions). */
export default function RibbonMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-ribbon]");
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      section.querySelectorAll<HTMLElement>("[data-ribbon-track]").forEach((track) => {
        const dir = Number(track.dataset.ribbonTrack);
        gsap.fromTo(
          track,
          { xPercent: dir > 0 ? -33.333 : 0 },
          {
            xPercent: dir > 0 ? 0 : -33.333,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);
  return null;
}
