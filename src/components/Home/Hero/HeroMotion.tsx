"use client";

import { useEffect } from "react";
import { gsap, SplitText, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { onLoaderDone } from "@/lib/loader";

/**
 * Hero choreography (≈1.6s total, no bounce):
 *  image reveals through a mask → eyebrow → headline letter by letter →
 *  copy line by line → CTAs → decorative frame + seal settle.
 * Scroll-away: photo scales gently, copy drifts up — all transform/opacity.
 */
export default function HeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;
    const $ = (s: string) => hero.querySelector<HTMLElement>(s)!;
    const $$ = (s: string) => hero.querySelectorAll<HTMLElement>(s);
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const title = SplitText.create($("[data-hero-title]"), { type: "chars,words", mask: "words" });
      const intro = SplitText.create($("[data-hero-intro]"), { type: "lines", mask: "lines", aria: "none" });

      // The photo is the LCP element: masked reveal on desktop only; on phones it is visible at once.
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      if (desktop) {
        gsap.set($("[data-hero-frame]"), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set($("[data-hero-img]"), { scale: 1.22 });
      }
      gsap.set([$("[data-hero-eyebrow]"), $("[data-hero-cta]"), $("[data-hero-points]")], { autoAlpha: 0, y: 18 });
      gsap.set(title.chars, { yPercent: 105 });
      gsap.set(intro.lines, { yPercent: 105 });
      gsap.set($$("[data-hero-deco]"), { autoAlpha: 0, x: 16, y: 16 });

      const off = onLoaderDone(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });
        if (desktop) {
          tl.to($("[data-hero-frame]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EASE.heavy }, 0).to($("[data-hero-img]"), { scale: 1, duration: 1.8 }, 0);
        }
        tl
          .to($("[data-hero-eyebrow]"), { autoAlpha: 1, y: 0, duration: 0.7 }, 0.15)
          .to(title.chars, { yPercent: 0, duration: 0.9, stagger: 0.012 }, 0.2)
          .to(intro.lines, { yPercent: 0, duration: 0.9, stagger: 0.07 }, 0.55)
          .to([$("[data-hero-cta]"), $("[data-hero-points]")], { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.75)
          .to($$("[data-hero-deco]"), { autoAlpha: 1, x: 0, y: 0, duration: 1.1, stagger: 0.1 }, 0.8);
      });

      // Scroll-away
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      gsap.fromTo($("[data-hero-img]"), { scale: 1, yPercent: 0 }, { scale: 1.12, yPercent: 6, ease: "none", scrollTrigger: st, immediateRender: false });
      gsap.fromTo($("[data-hero-copy]"), { y: 0, opacity: 1 }, { y: -70, opacity: 0.2, ease: "none", scrollTrigger: st });

      return off;
    });

    return () => mm.revert();
  }, []);

  return null;
}
