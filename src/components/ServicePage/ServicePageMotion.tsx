"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { onLoaderDone } from "@/lib/loader";
import { revealChars, revealLines } from "@/lib/reveal";

/**
 * Choreography for the inner-service template (shared by every service).
 * Generic text entrances come from ScrollEffects; each section here has its
 * own move:
 *   hero       the colour washes up, the book turns in on its spine, ribbon drops
 *   story      abandoned drafts are struck through as you read (scrubbed)
 *   expertise  the circular plate opens; the four qualities light in turn
 *   midCta     the inscription rule draws
 *   process    pinned shelf — scrolling opens one spine at a time (desktop)
 *   value      the ledger inks in left to right
 *   showcase   covers rise onto the shelf
 *   blurbs     back-cover quotes ink in
 *   closing    the image page opens from the gutter
 * Every end state is fully visible; reverse scrolling replays scrubbed parts.
 */
export default function ServicePageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-service-page]");
    if (!root) return;
    const $ = (s: string, r: ParentNode = root) => r.querySelector<HTMLElement>(s);
    const $$ = (s: string, r: ParentNode = root) => gsap.utils.toArray<HTMLElement>(r.querySelectorAll(s));
    const once = (trigger: Element, start = "top 80%") => ({ trigger, start, once: true });
    const mm = gsap.matchMedia();

    mm.add({ motion: MQ.motion, desktop: "(min-width: 1024px)" }, (context) => {
      const { motion, desktop } = context.conditions as Record<string, boolean>;
      const cleanups: (() => void)[] = [];

      /* ---- Process: one open spine at a time ---- */
      const proc = $("[data-sp-process]");
      if (proc && desktop) {
        const steps = $$("[data-sp-step]", proc);
        const open = (i: number) => steps.forEach((s, j) => s.toggleAttribute("data-open", j === i));
        if (motion) {
          ScrollTrigger.create({
            trigger: proc,
            start: "top top",
            end: () => `+=${window.innerHeight * 0.6 * steps.length}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => open(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))),
          });
        } else {
          // reduced motion: no pin — hover / focus opens a spine
          steps.forEach((s, i) => {
            const on = () => open(i);
            s.addEventListener("pointerenter", on);
            s.addEventListener("focusin", on);
            cleanups.push(() => (s.removeEventListener("pointerenter", on), s.removeEventListener("focusin", on)));
          });
        }
        cleanups.push(() => open(0));
      }

      if (!motion) return () => cleanups.forEach((c) => c());

      /* ---- Hero ---- */
      const hero = $("[data-sp-hero]");
      if (hero) {
        const book = $("[data-sp-book]", hero)!;
        gsap.set($("[data-sp-wash]", hero), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(book, { rotationY: -75, rotationX: 3, y: 60, autoAlpha: 0 });
        gsap.set($("[data-sp-ribbon]", hero), { scaleY: 0 });
        gsap.set([$("[data-sp-fade]", hero), $("[data-sp-tagline]", hero)], { autoAlpha: 0, y: 16 });
        gsap.set($("[data-sp-title]", hero), { autoAlpha: 0 });
        gsap.set($("[data-sp-lead]", hero), { autoAlpha: 0 });
        gsap.set($$("[data-sp-cta] > *", hero), { autoAlpha: 0, y: 22 });
        cleanups.push(
          onLoaderDone(() =>
            context.add(() => {
              gsap
                .timeline({ defaults: { ease: EASE.reveal } })
                .to($("[data-sp-wash]", hero), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: EASE.heavy }, 0)
                .to(book, { autoAlpha: 1, y: 0, duration: 1.4 }, 0.35)
                .to(book, { rotationY: -22, duration: 2, ease: "expo.out" }, 0.35)
                .to($("[data-sp-ribbon]", hero), { scaleY: 1, duration: 1.2, ease: "bounce.out" }, 1.4)
                .to($("[data-sp-fade]", hero), { autoAlpha: 1, y: 0, duration: 0.8 }, 0.3)
                .add(revealChars($("[data-sp-title]", hero)!, { duration: 1.1 }), 0.45)
                .to($("[data-sp-tagline]", hero), { autoAlpha: 1, y: 0, duration: 1 }, 0.95)
                .add(revealLines($("[data-sp-lead]", hero)!), 1.05)
                .to($$("[data-sp-cta] > *", hero), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.3);
            }),
          ),
        );
        // the book lifts and turns a touch as the page leaves the hero
        gsap.to(book, { yPercent: -10, rotationY: -8, ease: "none", immediateRender: false, scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } });
      }

      /* ---- Story: drafts struck through as you read ---- */
      const drafts = $("[data-sp-drafts]");
      if (drafts) {
        const strikes = $$("[data-sp-strike]", drafts);
        const tl = gsap.timeline({ scrollTrigger: { trigger: drafts, start: "top 75%", end: "bottom 45%", scrub: 0.6 } });
        strikes.forEach((s) => tl.to(s, { scaleX: 1, ease: "none", duration: 1 }).to(s.parentElement, { opacity: 0.45, duration: 0.3 }, "<0.7"));
        tl.fromTo($("[data-sp-final]", drafts), { x: -20, opacity: 0.3 }, { x: 0, opacity: 1, duration: 1 });
      }

      /* ---- Expertise: the plate opens, qualities light in turn ---- */
      const exp = $("[data-sp-expertise]");
      if (exp) {
        const plate = $("[data-sp-plate]", exp)!;
        const points = $$("[data-sp-point]", exp);
        const tl = gsap.timeline({ scrollTrigger: { trigger: plate, start: "top 85%", end: "bottom 35%", scrub: 0.6 } });
        tl.fromTo(plate, { clipPath: "circle(8% at 50% 50%)" }, { clipPath: "circle(50% at 50% 50%)", ease: "power2.out", duration: 2 }, 0);
        if (desktop) {
          gsap.set(points, { opacity: 0.25 });
          points.forEach((p, i) => tl.to(p, { opacity: 1, duration: 0.5 }, 0.4 + i * 0.45));
        }
      }

      /* ---- Mid CTA rule ---- */
      const rule = $("[data-sp-mid-rule]");
      if (rule) gsap.from(rule, { [desktop ? "scaleY" : "scaleX"]: 0, transformOrigin: desktop ? "50% 0" : "0 50%", duration: 1.4, ease: EASE.heavy, scrollTrigger: once(rule) });

      /* ---- Value ledger ---- */
      const ledger = $$("[data-sp-ledger-item]");
      if (ledger.length) gsap.from(ledger, { clipPath: "inset(0% 100% 0% 0%)", duration: 1.2, ease: EASE.heavy, stagger: 0.15, clearProps: "clipPath", scrollTrigger: once(ledger[0].parentElement!) });

      /* ---- Showcase covers ---- */
      const covers = $$("[data-sp-cover]");
      if (covers.length) gsap.from(covers, { y: 90, rotationY: 30, autoAlpha: 0, duration: 1.5, ease: EASE.reveal, stagger: 0.12, scrollTrigger: once(covers[0].parentElement!, "top 82%") });

      /* ---- Back-cover blurbs ---- */
      $$("[data-sp-blurb]").forEach((b, i) =>
        gsap.from(b, { clipPath: "inset(0% 0% 100% 0%)", y: 24, duration: 1.1, ease: EASE.reveal, delay: (i % 3) * 0.08, clearProps: "clipPath", scrollTrigger: once(b, "top 90%") }),
      );

      /* ---- Closing: the image page opens from the gutter ---- */
      const media = $("[data-sp-closing-media]");
      if (media) gsap.fromTo(media, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: EASE.heavy, scrollTrigger: once(media, "top 75%") });

      return () => cleanups.forEach((c) => c());
    });

    return () => mm.revert();
  }, []);

  return null;
}
