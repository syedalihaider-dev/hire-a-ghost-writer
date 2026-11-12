"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { onLoaderDone } from "@/lib/loader";
import { revealChars, revealLines } from "@/lib/reveal";

/**
 * Bespoke choreography for /services/. Generic text entrances use the shared
 * declarative layer (ScrollEffects: data-reveal, data-parallax, marquee);
 * this owns each section's signature move so no two sections enter alike:
 *
 *   hero      — plate wipes in from the right, desk objects land in depth
 *   catalogue — plates wipe from the side they face; rail tracks reading;
 *               hovered plates tilt toward the pointer
 *   craft     — rows slide in, the signature draws, margin leaders extend
 *   voices    — each typographic voice rises out of its mask
 *   terms     — the seal turns with scroll, clauses close in from both sides
 *   journey   — pinned notepad: sheets flip up over the binding
 *   finale    — the book opens as the section arrives
 *
 * One gsap.matchMedia → reduced-motion gets the static page; all of it
 * reverts on unmount. Lenis drives ScrollTrigger from the shared ticker.
 */
export default function ServicesMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    const $ = (root: ParentNode, s: string) => root.querySelector<HTMLElement>(s)!;
    const $$ = (root: ParentNode, s: string) => gsap.utils.toArray<HTMLElement>(root.querySelectorAll(s));
    const once = (trigger: Element, start = "top 80%") => ({ trigger, start, once: true });

    mm.add({ motion: MQ.motion, desktop: "(min-width: 1024px)", fine: "(hover: hover) and (pointer: fine)" }, (context) => {
      const { motion, desktop, fine } = context.conditions as Record<string, boolean>;
      const cleanups: (() => void)[] = [];

      /* ---------------- Rail: track the entry being read (all modes) ---------------- */
      const cat = document.querySelector<HTMLElement>("[data-catalogue]");
      if (cat) {
        const links = $$(cat, "[data-rail]");
        const strip = links[0]?.closest("ol");
        $$(cat, "[data-entry]").forEach((entry) => {
          ScrollTrigger.create({
            trigger: entry,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (!self.isActive) return;
              links.forEach((l) => l.toggleAttribute("data-current", l.dataset.rail === entry.id));
              const cur = links.find((l) => l.dataset.rail === entry.id);
              // keep the current tab in view on the swipeable mobile strip
              if (cur && strip && strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: cur.offsetLeft - 16, behavior: motion ? "smooth" : "auto" });
            },
          });
        });
      }

      if (!motion) return;

      /* ---------------- Hero ---------------- */
      const hero = document.querySelector<HTMLElement>("[data-sv-hero]");
      if (hero) {
        const plate = $(hero, "[data-sv-plate]");
        const img = $(hero, "[data-sv-img]");
        const inset = $(hero, "[data-sv-inset]");
        const card = $(hero, "[data-sv-card]");
        const spines = $$(hero, "[data-sv-spine]");
        const title = $(hero, "[data-sv-title]");
        const ctas = $$(hero, "[data-sv-cta] > *");
        const contents = $$(hero, "[data-sv-contents] li");
        const details = $$(hero, "[data-sv-detail]");

        gsap.set(plate, { clipPath: "inset(0% 0% 0% 100%)" });
        gsap.set(img, { scale: 1.25, xPercent: 6 });
        gsap.set($$(hero, "[data-sv-rules] i"), { scaleY: 0 });
        gsap.set($(hero, "[data-sv-light]"), { autoAlpha: 0 });
        gsap.set($(hero, "[data-sv-eyebrow]"), { autoAlpha: 0, y: 14 });
        gsap.set(title, { autoAlpha: 0 });
        gsap.set($(hero, "[data-sv-intro]"), { autoAlpha: 0 });
        gsap.set(ctas, { autoAlpha: 0, y: 24 });
        gsap.set(inset, { autoAlpha: 0, y: -70, rotation: -16 });
        gsap.set(card, { autoAlpha: 0, y: 140, rotation: 14 });
        gsap.set(spines, { autoAlpha: 0, xPercent: 70 });
        gsap.set(contents, { autoAlpha: 0, y: 12 });
        gsap.set(details, { autoAlpha: 0 });

        cleanups.push(
          onLoaderDone(() =>
            context.add(() => {
              gsap
                .timeline({ defaults: { ease: EASE.reveal } })
                .to(plate, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: EASE.heavy }, 0)
                .to(img, { scale: 1, xPercent: 0, duration: 2.4 }, 0)
                .to($$(hero, "[data-sv-rules] i"), { scaleY: 1, duration: 1.8, ease: EASE.transition, stagger: 0.12 }, 0.1)
                .to($(hero, "[data-sv-light]"), { autoAlpha: 1, duration: 2 }, 0.2)
                .to($(hero, "[data-sv-eyebrow]"), { autoAlpha: 1, y: 0, duration: 0.9 }, 0.3)
                .add(revealChars(title, { duration: 1.1 }), 0.42)
                .add(revealLines($(hero, "[data-sv-intro]")), 0.95)
                .to(ctas, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1 }, 1.2)
                .to(inset, { autoAlpha: 1, y: 0, rotation: -5, duration: 1.4 }, 0.8)
                .to(card, { autoAlpha: 1, y: 0, rotation: 3, duration: 1.5 }, 1.0)
                .to(spines, { autoAlpha: 1, xPercent: 0, duration: 1.3, stagger: 0.1 }, 1.2)
                .to(contents, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05 }, 1.4)
                .to(details, { autoAlpha: 1, duration: 1.2 }, 1.7);
            }),
          ),
        );

        // depth while leaving — objects part at different speeds
        const st = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 };
        $$(hero, "[data-depth]").forEach((el) => {
          const d = parseFloat(el.dataset.depth || "1");
          gsap.to(el, { yPercent: -d * 14, ease: "none", scrollTrigger: st });
        });
        gsap.to(img, { yPercent: 6, ease: "none", scrollTrigger: st });

        if (desktop && fine) {
          const layers = $$(hero, "[data-depth]").map((el) => ({ d: parseFloat(el.dataset.depth || "1"), x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }) }));
          const onMove = (e: PointerEvent) => {
            const px = e.clientX / window.innerWidth - 0.5;
            layers.forEach((l) => l.x(px * -16 * l.d));
          };
          hero.addEventListener("pointermove", onMove);
          cleanups.push(() => hero.removeEventListener("pointermove", onMove));
        }
      }

      /* ---------------- Catalogue plates ---------------- */
      if (cat) {
        $$(cat, "[data-entry]").forEach((entry) => {
          const frame = $(entry, "[data-entry-frame]");
          const img = $(entry, "[data-entry-img]");
          const layout = entry.dataset.layout || "";
          const from = layout === "pair" ? "inset(100% 0% 0% 0%)" : layout.endsWith("rev") ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
          gsap.set(frame, { clipPath: from });
          gsap.set(img, { scale: 1.22 });
          ScrollTrigger.create({
            ...once(frame, "top 82%"),
            onEnter: () =>
              context.add(() => {
                gsap.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE.heavy });
                gsap.to(img, { scale: 1, duration: 2.2, ease: EASE.reveal });
              }),
          });
          // slow drift of the photograph inside its frame
          gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });

          if (desktop && fine) {
            const media = $(entry, "[data-entry-media]");
            const ry = gsap.quickTo(frame, "rotationY", { duration: 0.9, ease: "power3.out" });
            const rx = gsap.quickTo(frame, "rotationX", { duration: 0.9, ease: "power3.out" });
            const lift = gsap.quickTo(frame, "z", { duration: 0.9, ease: "power3.out" });
            const onMove = (e: PointerEvent) => {
              const b = media.getBoundingClientRect();
              ry(((e.clientX - b.left) / b.width - 0.5) * 9);
              rx(((e.clientY - b.top) / b.height - 0.5) * -7);
              lift(30);
            };
            const onLeave = () => (ry(0), rx(0), lift(0));
            media.addEventListener("pointermove", onMove);
            media.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              media.removeEventListener("pointermove", onMove);
              media.removeEventListener("pointerleave", onLeave);
            });
          }
        });
      }

      /* ---------------- Craft ---------------- */
      $$(document, "[data-instrument]").forEach((row, i) => {
        gsap.from(row.children, { xPercent: i % 2 ? 6 : -6, autoAlpha: 0, duration: 1.2, ease: EASE.reveal, stagger: 0.08, scrollTrigger: once(row, "top 85%") });
      });
      const sign = document.querySelector<SVGPathElement>("[data-sv-sign]");
      if (sign) {
        const len = sign.getTotalLength();
        gsap.fromTo(sign, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut", scrollTrigger: once(sign, "top 85%") });
      }
      $$(document, "[data-annot]").forEach((a) => {
        gsap.from($(a, "[data-annot-line]"), { scaleX: 0, duration: 1.2, ease: EASE.heavy, scrollTrigger: once(a, "top 80%") });
        gsap.from(a.querySelectorAll("h3, p"), { y: 30, autoAlpha: 0, duration: 1, ease: EASE.reveal, stagger: 0.1, delay: 0.3, scrollTrigger: once(a, "top 80%") });
      });

      /* ---------------- Voices ---------------- */
      $$(document, "[data-voice]").forEach((v, i) => {
        gsap.from($(v, "[data-voice-word]"), { yPercent: 110, rotation: i % 2 ? 2 : -2, duration: 1.3, ease: EASE.reveal, scrollTrigger: once(v, "top 85%") });
      });

      /* ---------------- Terms ---------------- */
      const ring = document.querySelector<HTMLElement>("[data-seal-ring]");
      if (ring) {
        gsap.fromTo(ring, { rotation: -40 }, { rotation: 140, ease: "none", transformOrigin: "50% 50%", scrollTrigger: { trigger: ring, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        gsap.from($(document, "[data-seal-core]"), { scale: 0.6, autoAlpha: 0, duration: 1.4, ease: "back.out(1.4)", scrollTrigger: once(ring) });
        $$(document, "[data-clause]").forEach((c, i) => {
          gsap.from(c, { x: desktop ? (i < 3 ? -60 : 60) : 0, y: desktop ? 0 : 30, autoAlpha: 0, duration: 1.2, ease: EASE.reveal, delay: (i % 3) * 0.1, scrollTrigger: once(c, "top 88%") });
        });
      }

      /* ---------------- Journey (desktop pin) ---------------- */
      const journey = document.querySelector<HTMLElement>("[data-journey]");
      if (journey && desktop) {
        const sheets = $$(journey, "[data-jr-sheet]");
        const steps = $$(journey, "[data-jr-step]");
        const count = $(journey, "[data-jr-count]");
        const n = sheets.length;
        // stacked pad: a hair of depth per sheet (z-index is ignored inside preserve-3d)
        sheets.forEach((s, i) => gsap.set(s, { z: -i * 2, y: i * 5 }));
        let current = 0;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: journey,
            start: "top top",
            end: () => `+=${window.innerHeight * 0.75 * (n - 1)}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(n - 1, Math.floor(self.progress * (n - 1) + 0.5));
              if (i === current) return;
              current = i;
              steps.forEach((s, j) => s.toggleAttribute("data-active", j === i));
              count.textContent = String(i + 1).padStart(2, "0");
              gsap.fromTo(count, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: EASE.reveal, overwrite: true });
            },
          },
        });
        sheets.slice(0, -1).forEach((s, i) => {
          tl.to(s, { rotationX: 172, y: -30, duration: 1, ease: "power2.inOut" }, i).to(sheets.slice(i + 1), { y: (k) => k * 5, z: (k) => -k * 2, duration: 0.6, ease: "power2.out" }, i + 0.4);
        });
        cleanups.push(() => {
          steps.forEach((s, j) => s.toggleAttribute("data-active", j === 0));
          count.textContent = "01";
        });
      }

      /* ---------------- Finale: the book opens ---------------- */
      const finale = document.querySelector<HTMLElement>("[data-finale]");
      if (finale) {
        const left = $(finale, "[data-finale-left]");
        const right = $(finale, "[data-finale-right]");
        if (desktop) {
          const st = { trigger: finale, start: "top 85%", end: "top 15%", scrub: 0.8 };
          gsap.fromTo(left, { rotationY: 95 }, { rotationY: 0, ease: "power2.out", scrollTrigger: st });
          gsap.fromTo(right, { rotationY: -28, z: -40 }, { rotationY: 0, z: 0, ease: "power2.out", scrollTrigger: st });
        } else {
          gsap.from([left, right], { y: 60, autoAlpha: 0, duration: 1.2, ease: EASE.reveal, stagger: 0.15, scrollTrigger: once(finale) });
        }
      }

      return () => cleanups.forEach((c) => c());
    });

    return () => mm.revert();
  }, []);

  return null;
}
