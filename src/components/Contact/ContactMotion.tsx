"use client";

import { useEffect } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { onLoaderDone } from "@/lib/loader";
import { revealChars, revealLines } from "@/lib/reveal";

/**
 * Contact choreography (text entrances elsewhere come from ScrollEffects):
 *   hero    the envelope settles, its flap lifts, the photograph slides out,
 *           the note card drops onto the desk; headline by character
 *   letter  the paper slides up from below like a sheet drawn from a drawer
 *   steps   "what happens next" rules draw in sequence
 *   studio  the address rows ink in from the left
 * All end states fully visible; reduced motion gets the static page.
 */
export default function ContactMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    const q = (s: string, r: ParentNode = document) => r.querySelector<HTMLElement>(s);
    const qa = (s: string, r: ParentNode = document) => gsap.utils.toArray<HTMLElement>(r.querySelectorAll(s));
    const once = (trigger: Element, start = "top 80%") => ({ trigger, start, once: true });

    mm.add(MQ.motion, (context) => {
      const cleanups: (() => void)[] = [];
      const hero = q("[data-ct-hero]");
      if (hero) {
        const env = q("[data-ct-envelope]", hero)!;
        const flap = q("[data-ct-flap]", hero)!;
        const photo = q("[data-ct-photo]", hero)!;
        const card = q("[data-ct-card]", hero)!;
        gsap.set(env, { y: 120, rotation: -10, autoAlpha: 0 });
        gsap.set(flap, { rotationX: 0 });
        gsap.set(photo, { yPercent: 62 });
        gsap.set(card, { y: -90, rotation: -8, autoAlpha: 0 });
        gsap.set(q("[data-ct-seal]", hero), { scale: 0 });
        gsap.set(qa("[data-ct-fade]", hero), { autoAlpha: 0, y: 14 });
        gsap.set(q("[data-ct-title]", hero), { autoAlpha: 0 });
        gsap.set(q("[data-ct-text]", hero), { autoAlpha: 0 });
        gsap.set(qa("[data-ct-cta] > *", hero), { autoAlpha: 0, y: 22 });
        cleanups.push(
          onLoaderDone(() =>
            context.add(() => {
              gsap
                .timeline({ defaults: { ease: EASE.reveal } })
                .to(env, { y: 0, rotation: -4, autoAlpha: 1, duration: 1.5 }, 0.1)
                .to(q("[data-ct-seal]", hero), { scale: 1, duration: 0.6, ease: "back.out(2)" }, 0.9)
                .to(flap, { rotationX: 178, duration: 1.3, ease: EASE.transition }, 1.2)
                .to(photo, { yPercent: 0, duration: 1.6, ease: "expo.out" }, 1.8)
                .to(card, { y: 0, rotation: 5, autoAlpha: 1, duration: 1.3 }, 2.0)
                .to(qa("[data-ct-fade]", hero)[0], { autoAlpha: 1, y: 0, duration: 0.8 }, 0.3)
                .add(revealChars(q("[data-ct-title]", hero)!, { duration: 1.1 }), 0.45)
                .to(qa("[data-ct-fade]", hero)[1], { autoAlpha: 1, y: 0, duration: 0.9 }, 1.0)
                .add(revealLines(q("[data-ct-text]", hero)!), 1.1)
                .to(qa("[data-ct-cta] > *", hero), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.35);
            }),
          ),
        );
        // the envelope drifts slower than the page as you leave
        gsap.to(q("[data-ct-desk]", hero), { yPercent: -8, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } });
      }

      const paper = q("[data-ct-paper]");
      if (paper) gsap.from(paper, { y: 160, rotation: 1.5, duration: 1.6, ease: EASE.reveal, scrollTrigger: once(paper, "top 92%") });

      const steps = qa("[data-ct-step]");
      if (steps.length) gsap.from(steps, { clipPath: "inset(0% 100% 0% 0%)", duration: 1.1, ease: EASE.heavy, stagger: 0.15, clearProps: "clipPath", scrollTrigger: once(steps[0]) });

      const rows = qa("[data-ct-row]");
      if (rows.length) gsap.from(rows, { x: -40, autoAlpha: 0, duration: 1.1, ease: EASE.reveal, stagger: 0.12, scrollTrigger: once(rows[0]) });

      return () => cleanups.forEach((c) => c());
    });
    return () => mm.revert();
  }, []);
  return null;
}
