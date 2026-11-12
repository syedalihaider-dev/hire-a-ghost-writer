"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { onLoaderDone } from "@/lib/loader";
import { revealChars, revealLines, revealWords } from "@/lib/reveal";

const PLATE_ROUND = "round 999px 999px 4px 4px";

/**
 * Bespoke choreography for the About page. Generic entrances (data-reveal,
 * data-parallax, figure wipes) are handled by ScrollEffects; this owns the
 * set pieces. Everything sits in one gsap.matchMedia, so reduced-motion users
 * get the static, fully readable page and every effect reverts on unmount.
 * Lenis already drives ScrollTrigger from the shared GSAP ticker.
 */
export default function AboutMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    const $ = <T extends Element = HTMLElement>(root: ParentNode, s: string) => root.querySelector<T>(s)!;
    const $$ = (root: ParentNode, s: string) => gsap.utils.toArray<HTMLElement>(root.querySelectorAll(s));

    mm.add({ motion: MQ.motion, desktop: "(min-width: 1024px)", fine: "(hover: hover) and (pointer: fine)" }, (context) => {
      const { motion, desktop, fine } = context.conditions as Record<string, boolean>;
      const cleanups: (() => void)[] = [];
      const dur = motion ? 1 : 0;

      /* ---------------- Frontispiece ---------------- */
      const hero = document.querySelector<HTMLElement>("[data-about-hero]");
      if (hero && motion) {
        const plate = $(hero, "[data-ah-plate]");
        const img = $(hero, "[data-ah-img]");
        const title = $(hero, "[data-ah-title]");
        const leaf = $(hero, "[data-ah-leaf]");
        const lines = $$(hero, "[data-ah-line]");
        const notes = $$(hero, "[data-ah-note]");
        const slip = $(hero, "[data-ah-slip]");
        const details = $$(hero, "[data-ah-detail]");
        const ctas = $$(hero, "[data-ah-cta] > *");

        gsap.set(plate, { clipPath: `inset(100% 0% 0% 0% ${PLATE_ROUND})` });
        gsap.set(img, { scale: 1.3 });
        gsap.set(title, { autoAlpha: 0 });
        gsap.set($(hero, "[data-ah-eyebrow]"), { autoAlpha: 0, y: 16 });
        gsap.set($(hero, "[data-ah-intro]"), { autoAlpha: 0 });
        gsap.set(ctas, { autoAlpha: 0, y: 24 });
        gsap.set(leaf, { autoAlpha: 0, y: 110, rotation: -14 });
        gsap.set(lines, { clipPath: "inset(-20% 100% -20% 0%)" });
        gsap.set(notes, { autoAlpha: 0, x: -12 });
        gsap.set(slip, { autoAlpha: 0, y: 50 });
        gsap.set(details, { autoAlpha: 0 });
        gsap.set($(hero, "[data-ah-light]"), { autoAlpha: 0, scale: 0.8 });
        gsap.set($(hero, "[data-ah-watermark]"), { autoAlpha: 0, xPercent: 8 });

        const off = onLoaderDone(() =>
          context.add(() => {
            gsap
              .timeline({ defaults: { ease: EASE.reveal } })
              // 1 · the composition opens
              .to(plate, { clipPath: `inset(0% 0% 0% 0% ${PLATE_ROUND})`, duration: 1.6, ease: EASE.heavy }, 0)
              .to(img, { scale: 1, duration: 2.4 }, 0)
              .to($(hero, "[data-ah-light]"), { autoAlpha: 1, scale: 1, duration: 2.2 }, 0.1)
              .to($(hero, "[data-ah-watermark]"), { autoAlpha: 1, xPercent: 0, duration: 2.6 }, 0.2)
              // 2 · the headline, letter by letter
              .to($(hero, "[data-ah-eyebrow]"), { autoAlpha: 1, y: 0, duration: 0.9 }, 0.3)
              .add(revealChars(title, { duration: 1.15 }), 0.42)
              // 3 · the manuscript is laid down and writes itself
              .to(leaf, { autoAlpha: 1, y: 0, rotation: -4, duration: 1.5 }, 0.85)
              .to(lines, { clipPath: "inset(-20% 0% -20% 0%)", duration: 0.6, ease: "power2.inOut", stagger: 0.13 }, 1.25)
              // 4 · supporting copy + CTA
              .add(revealLines($(hero, "[data-ah-intro]")), 1.0)
              .to(ctas, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 1.3)
              // 5 · editorial details
              .to(details, { autoAlpha: 1, duration: 1.2, stagger: 0.12 }, 1.5)
              .to(slip, { autoAlpha: 1, y: 0, duration: 1.2 }, 1.7)
              .to(notes, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.25 }, 2.1);
          }),
        );
        cleanups.push(off);

        // 6 · depth while leaving: layers part at different speeds (scrubbed, reversible)
        const st = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 };
        gsap.to(img, { yPercent: 8, ease: "none", scrollTrigger: st });
        gsap.to(leaf, { yPercent: -22, ease: "none", scrollTrigger: st });
        gsap.to(slip, { yPercent: -90, ease: "none", scrollTrigger: st });
        gsap.to($(hero, "[data-ah-watermark]"), { xPercent: -12, ease: "none", scrollTrigger: st });

        // pointer: a gentle parallax across the layers (desktop only)
        if (desktop && fine) {
          const layers = $$(hero, "[data-depth]").map((el) => ({ depth: parseFloat(el.dataset.depth || "1"), x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }) }));
          const onMove = (e: PointerEvent) => {
            const px = e.clientX / window.innerWidth - 0.5;
            layers.forEach((l) => l.x(px * -18 * l.depth));
          };
          hero.addEventListener("pointermove", onMove);
          cleanups.push(() => hero.removeEventListener("pointermove", onMove));
        }
      }

      /* ---------------- Chapter I · statement lit word by word ---------------- */
      const statement = document.querySelector<HTMLElement>("[data-scrub-words]");
      if (statement && motion) {
        const split = SplitText.create(statement, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 40%", scrub: true } },
        );
        cleanups.push(() => split.revert());
      }

      /* ---------------- Chapter II · philosophy ---------------- */
      const ph = document.querySelector<HTMLElement>("[data-philosophy]");
      if (ph && motion) {
        const panels = $$(ph, "[data-ph-panel]");
        const reveal = (panel: HTMLElement) => {
          revealWords($(panel, "[data-ph-title]"));
          revealLines($(panel, "[data-ph-text]"), { delay: 0.2 });
          gsap.to($(panel, "[data-ph-rule]"), { scaleX: 1, duration: 1.2, ease: EASE.reveal, delay: 0.15 });
        };
        panels.forEach((p) => {
          gsap.set([$(p, "[data-ph-title]"), $(p, "[data-ph-text]")], { autoAlpha: 0 });
          gsap.set($(p, "[data-ph-rule]"), { scaleX: 0 });
        });

        // the paper chapter slides up over the ink one like a fresh page
        gsap.fromTo(
          ph,
          { clipPath: "inset(0% 4% 0% 4% round 28px 28px 0px 0px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "none", scrollTrigger: { trigger: ph, start: "top bottom", end: "top 25%", scrub: true } },
        );

        if (desktop) {
          const track = $(ph, "[data-ph-track]");
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
          const move = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: { trigger: ph, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
          });
          gsap.to($(ph, "[data-ph-progress]"), {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: ph, start: "top top", end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true },
          });
          panels.forEach((p) => {
            ScrollTrigger.create({ trigger: p, containerAnimation: move, start: "left 72%", once: true, onEnter: () => context.add(() => reveal(p)) });
            gsap.fromTo($(p, "[data-ph-numeral]"), { xPercent: 35 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: p, containerAnimation: move, start: "left right", end: "right left", scrub: true } });
          });
        } else {
          panels.forEach((p) => ScrollTrigger.create({ trigger: p, start: "top 80%", once: true, onEnter: () => context.add(() => reveal(p)) }));
        }
      }

      /* ---------------- Chapter IV · the manuscript evolves ---------------- */
      const pr = document.querySelector<HTMLElement>("[data-process]");
      if (pr) {
        const layers = $$(pr, "[data-pr-layer]");
        const stages = $$(pr, "[data-pr-stage]");
        const SHOWN = "inset(-25% -25% -25% -25%)";
        const BELOW = "inset(125% -25% -25% -25%)";
        let current = 0;
        gsap.set(layers.slice(1), { clipPath: BELOW });
        gsap.set(layers[0], { clipPath: SHOWN });

        const setStage = (i: number) => {
          if (i === current) return;
          layers.forEach((l, j) => {
            if (j <= i && j > current) {
              gsap.fromTo(l, { clipPath: BELOW, y: 40 }, { clipPath: SHOWN, y: 0, duration: 1.1 * dur, ease: EASE.heavy, overwrite: true });
            } else if (j > i && j <= current) {
              gsap.to(l, { clipPath: BELOW, duration: 0.6 * dur, ease: "power3.in", overwrite: true });
            }
          });
          stages.forEach((s, j) => s.toggleAttribute("data-active", j === i));
          current = i;
        };
        stages.forEach((s, i) =>
          ScrollTrigger.create({ trigger: s, start: desktop ? "top 55%" : "top 62%", end: desktop ? "bottom 55%" : "bottom 62%", onToggle: (self) => self.isActive && setStage(i) }),
        );
        gsap.fromTo(
          $(pr, "[data-pr-progress]"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: stages[0].parentElement, start: "top 55%", end: "bottom 55%", scrub: true } },
        );
        cleanups.push(() => stages.forEach((s, j) => s.toggleAttribute("data-active", j === 0)));
      }

      /* ---------------- Chapter V · the dividing rule ---------------- */
      const rule = document.querySelector<HTMLElement>("[data-diff-rule]");
      if (rule && motion) {
        gsap.from(rule, { [desktop ? "scaleY" : "scaleX"]: 0, transformOrigin: desktop ? "50% 0%" : "0% 50%", duration: 1.8, ease: EASE.heavy, scrollTrigger: { trigger: rule, start: "top 80%", once: true } });
        gsap.from(rule.firstElementChild, { scale: 0, rotation: -90, duration: 1.2, ease: "back.out(1.6)", delay: 0.6, scrollTrigger: { trigger: rule, start: "top 80%", once: true } });
      }

      /* ---------------- Epilogue · the blank page ---------------- */
      const page = document.querySelector<HTMLElement>("[data-cta-page] > *");
      if (page && motion) {
        gsap.set(page, { rotation: 3, rotationY: -8 });
        gsap.from(page, { y: 140, rotation: 14, autoAlpha: 0, duration: 1.8, ease: EASE.reveal, scrollTrigger: { trigger: page, start: "top 88%", once: true } });
        if (desktop && fine) {
          const ry = gsap.quickTo(page, "rotationY", { duration: 1.2, ease: "power3.out" });
          const rx = gsap.quickTo(page, "rotationX", { duration: 1.2, ease: "power3.out" });
          const section = page.closest("section")!;
          const onMove = (e: PointerEvent) => {
            const b = section.getBoundingClientRect();
            ry(-8 + ((e.clientX - b.left) / b.width - 0.5) * 16);
            rx(((e.clientY - b.top) / b.height - 0.5) * -8);
          };
          section.addEventListener("pointermove", onMove);
          cleanups.push(() => section.removeEventListener("pointermove", onMove));
        }
      }

      return () => cleanups.forEach((c) => c());
    });

    return () => mm.revert();
  }, []);

  return null;
}
