"use client";

import { useEffect } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { onLoaderDone } from "@/lib/loader";
import { revealChars, revealLines } from "@/lib/reveal";
import { bookParts, floatBook, tiltBook } from "@/components/UI/Book3D/bookMotion";

const REST = { x: 6, y: -28 };

/**
 * Hero choreography — one timeline, staged rather than simultaneous (~2.4s):
 *
 *   0.00  arch window wipes open, photograph settles (desktop/tablet)
 *   0.10  atmosphere: hairlines draw, light blooms, watermark slides in
 *   0.35  eyebrow
 *   0.45  headline — masked characters with a slight 3D tip
 *   0.90  manuscript leaf drops in behind the arch
 *   0.95  intro — line by line
 *   1.00  the hardcover rises and turns toward the reader; cover swings open
 *         a little, then settles ajar
 *   1.20  CTAs, then the numbered promises
 *   1.50  seal, caption tags, vertical label, light sweeps the foil
 *   end → idle: float loop + pointer tilt; scroll takes over.
 *
 * Scroll (scrubbed, reversible): copy lifts and fades, the window sinks and its
 * photo zooms, the leaf slides out, the book rises faster than the page and
 * its cover opens — the story begins as you start reading.
 */
export default function HeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const parts = hero && bookParts(hero);
    if (!hero || !parts) return;
    const $ = (s: string) => hero.querySelector<HTMLElement>(s)!;
    const $$ = (s: string) => gsap.utils.toArray<HTMLElement>(hero.querySelectorAll(s));
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const wide = window.matchMedia("(min-width: 768px)").matches;
      const frame = $("[data-hero-frame]");
      const img = $("[data-hero-img]");
      const floatEl = $("[data-hero-float]");
      const bookWrap = $("[data-hero-book]");
      const cleanups: (() => void)[] = [];

      // Pre-states (the preloader still covers the page, so nothing flashes).
      // On phones the photograph is the likely LCP element — it stays visible.
      if (wide) {
        gsap.set(frame, { clipPath: "inset(100% 0% 0% 0% round 999px 999px 4px 4px)" });
        gsap.set(img, { scale: 1.25 });
      }
      gsap.set($("[data-hero-title]"), { autoAlpha: 0 });
      gsap.set($("[data-hero-intro]"), { autoAlpha: 0 });
      gsap.set([$("[data-hero-eyebrow]"), $("[data-hero-points]")], { autoAlpha: 0, y: 16 });
      gsap.set($$("[data-hero-cta] > *"), { autoAlpha: 0, y: 22 });
      gsap.set($$("[data-hero-rule]"), { scaleY: 0 });
      gsap.set($("[data-hero-bg]"), { autoAlpha: 0, scale: 0.85 });
      gsap.set($("[data-hero-watermark]"), { autoAlpha: 0, xPercent: 8 });
      gsap.set($("[data-hero-arch-line]"), { autoAlpha: 0, scale: 0.94 });
      gsap.set($("[data-hero-sheet]"), { autoAlpha: 0, y: -60, rotation: -18 });
      gsap.set(bookWrap, { autoAlpha: 0, y: 140 });
      gsap.set(parts.body, { rotationX: 18, rotationY: -78 });
      gsap.set(parts.cover, { rotationY: 0 });
      gsap.set(parts.shadow, { autoAlpha: 0, scale: 0.5 });
      gsap.set([$("[data-hero-seal]"), $("[data-hero-vertical]")], { autoAlpha: 0 });
      gsap.set($$("[data-hero-tag]"), { autoAlpha: 0, y: 10 });

      const off = onLoaderDone(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });
        if (wide) {
          tl.to(frame, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 4px 4px)", duration: 1.5, ease: EASE.heavy }, 0).to(img, { scale: 1, duration: 2.2 }, 0);
        }
        tl.to($$("[data-hero-rule]"), { scaleY: 1, duration: 1.6, ease: EASE.transition, stagger: 0.15 }, 0.1)
          .to($("[data-hero-bg]"), { autoAlpha: 1, scale: 1, duration: 2 }, 0.1)
          .to($("[data-hero-watermark]"), { autoAlpha: 1, xPercent: 0, duration: 2.2 }, 0.2)
          .to($("[data-hero-arch-line]"), { autoAlpha: 1, scale: 1, duration: 1.4 }, 0.5)
          .to($("[data-hero-eyebrow]"), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
          .add(revealChars($("[data-hero-title]")), 0.45)
          .to($("[data-hero-sheet]"), { autoAlpha: 1, y: 0, rotation: -8, duration: 1.6 }, 0.9)
          .add(revealLines($("[data-hero-intro]")), 0.95)
          // the book: rises, turns to face the reader, cover breathes open then rests ajar
          .to(bookWrap, { autoAlpha: 1, y: 0, duration: 1.8 }, 1.0)
          .to(parts.body, { rotationX: REST.x, rotationY: REST.y, duration: 2.2, ease: "expo.out" }, 1.0)
          .to(parts.shadow, { autoAlpha: 1, scale: 1, duration: 1.6 }, 1.2)
          .to(parts.cover, { rotationY: -38, duration: 1.1, ease: EASE.transition }, 1.25)
          .to(parts.cover, { rotationY: -14, duration: 1.2, ease: "power2.inOut" }, 2.35)
          .to($$("[data-hero-cta] > *"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.2)
          .to($("[data-hero-points]"), { autoAlpha: 1, y: 0, duration: 0.9 }, 1.4)
          .to($("[data-hero-seal]"), { autoAlpha: 1, duration: 1 }, 1.5)
          .to($$("[data-hero-tag]"), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 }, 1.55)
          .to($("[data-hero-vertical]"), { autoAlpha: 1, duration: 1 }, 1.7)
          .fromTo(parts.sheen, { xPercent: -110 }, { xPercent: 150, duration: 1.6, ease: "power2.inOut" }, 2.0)
          .set(parts.sheen, { xPercent: -110 })
          .add(() => {
            cleanups.push(floatBook(floatEl, parts.shadow, wide ? 14 : 8));
            cleanups.push(tiltBook(hero, parts, REST));
            buildScrollOpen();
          });
      });

      // ---- Scroll response (scrubbed, transform/opacity only) ----
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to($("[data-hero-copy]"), { y: -80, autoAlpha: 0.15, ease: "none", scrollTrigger: st });
      gsap.to(frame, { yPercent: 10, ease: "none", scrollTrigger: st });
      gsap.fromTo(img, { scale: 1 }, { scale: 1.14, ease: "none", immediateRender: false, scrollTrigger: st });
      gsap.to($("[data-hero-arch-line]"), { yPercent: 4, ease: "none", scrollTrigger: st });
      gsap.to($("[data-hero-watermark]"), { xPercent: -14, ease: "none", scrollTrigger: st });
      gsap.to($("[data-hero-sheet]"), { x: -60, y: 90, ease: "none", scrollTrigger: st });

      // Book: created after the entrance so the scrub never fights the timeline.
      let built = false;
      const buildScrollOpen = () => {
        if (built) return;
        built = true;
        gsap.to(bookWrap, { y: wide ? -170 : -90, rotation: -4, ease: "none", scrollTrigger: st });
        gsap.fromTo(parts.cover, { rotationY: -14 }, { rotationY: -62, ease: "none", immediateRender: false, scrollTrigger: st });
      };

      return () => {
        off();
        cleanups.forEach((c) => c());
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
