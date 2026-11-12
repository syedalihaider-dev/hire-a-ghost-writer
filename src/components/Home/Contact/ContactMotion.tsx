"use client";

import { useEffect } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { bookParts, floatBook, tiltBook } from "@/components/UI/Book3D/bookMotion";

const REST = { x: 8, y: -30 };

/**
 * The finale: the hardcover arrives wide open on "The End" and closes as the
 * section settles into view (scrubbed, reversible). Once closed it floats and
 * answers the pointer like the hero book — the two bookend the page.
 */
export default function ContactMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-contact]");
    const slot = section?.querySelector<HTMLElement>("[data-contact-book]");
    const parts = section && bookParts(section);
    if (!section || !slot || !parts) return;
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const cleanups: (() => void)[] = [];
      gsap.set(parts.body, { rotationX: 14, rotationY: -8 });
      gsap.set(parts.cover, { rotationY: -165 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 15%",
            scrub: 0.8,
            onLeave: () => {
              if (cleanups.length) return;
              cleanups.push(floatBook(slot, parts.shadow, 8));
              cleanups.push(tiltBook(section, parts, REST, { x: 6, y: 12 }));
            },
          },
        })
        .to(parts.cover, { rotationY: 0, ease: "power1.inOut" }, 0)
        .to(parts.body, { rotationX: REST.x, rotationY: REST.y }, 0)
        .fromTo(parts.sheen, { xPercent: -110 }, { xPercent: 150 }, 0.6)
        .fromTo(section.querySelector("[data-contact-frame]"), { autoAlpha: 0, scale: 1.02 }, { autoAlpha: 1, scale: 1 }, 0);

      return () => cleanups.forEach((c) => c());
    });

    return () => mm.revert();
  }, []);

  return null;
}
