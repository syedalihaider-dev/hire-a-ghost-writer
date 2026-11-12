"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { revealWords } from "@/lib/reveal";

/**
 * Portfolio motion.
 *  Entrance (once, per work): the plate wipes open from below while its light
 *  settles, the outlined numeral slides in, the hardcover rises and turns to
 *  face the reader, then the caption — number, title word by word, author.
 *  The featured work runs a longer, more theatrical version.
 *  Depth (desktop, scrubbed): the smaller works drift at different speeds so
 *  the composition separates into layers as you scroll.
 *  Hover (fine pointer): the plate's light follows the cursor and the book
 *  tilts toward it.
 */
export default function ShowcaseMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-showcase]");
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const cleanups: (() => void)[] = [];
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;

      gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-work]")).forEach((work) => {
        const featured = work.hasAttribute("data-featured");
        const $ = (s: string) => work.querySelector<HTMLElement>(s)!;
        const plate = $("[data-plate]");
        const bg = $("[data-plate-bg]");
        const num = $("[data-plate-num]");
        const bookWrap = $("[data-plate-book]");
        const book = bookWrap.querySelector("img")!;
        const title = $("[data-cap-title]");
        const fades = work.querySelectorAll<HTMLElement>("[data-cap-fade]");

        gsap.set(plate, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(bookWrap, { autoAlpha: 0, y: featured ? 140 : 90, rotationY: featured ? -60 : -35 });
        gsap.set(num, { autoAlpha: 0, xPercent: -14 });
        gsap.set(fades, { autoAlpha: 0, y: 16 });
        gsap.set(title, { autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: plate,
          start: "top 82%",
          once: true,
          onEnter: () => {
            const d = featured ? 1.25 : 1;
            gsap
              .timeline({ defaults: { ease: EASE.reveal } })
              .to(plate, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 * d, ease: EASE.heavy, clearProps: "clipPath" }, 0)
              .fromTo(bg, { scale: 1.25 }, { scale: 1, duration: 2.2 * d }, 0)
              .to(num, { autoAlpha: 1, xPercent: 0, duration: 1.8 }, 0.3 * d)
              .to(bookWrap, { autoAlpha: 1, y: 0, duration: 1.6 * d }, 0.35 * d)
              .to(bookWrap, { rotationY: 0, duration: 2.2 * d, ease: "expo.out" }, 0.35 * d)
              .to(fades, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.18 }, 0.6 * d)
              .add(revealWords(title), 0.75 * d);
          },
        });

        // Layered depth: each small work drifts at its own rate.
        const depth = parseFloat(work.dataset.depth || "0");
        if (desktop && depth) {
          gsap.fromTo(work, { y: depth * 6 }, { y: -depth * 6, ease: "none", scrollTrigger: { trigger: work, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        }
        if (featured) {
          gsap.fromTo(num, { yPercent: 10 }, { yPercent: -10, ease: "none", immediateRender: false, scrollTrigger: { trigger: plate, start: "top bottom", end: "bottom top", scrub: 0.8 } });
        }

        // Hover: light follows the cursor, the book leans toward it.
        if (fine) {
          const light = { x: 50, y: 36 };
          const paint = () => {
            bg.style.setProperty("--mx", `${light.x}%`);
            bg.style.setProperty("--my", `${light.y}%`);
          };
          const lx = gsap.quickTo(light, "x", { duration: 0.9, ease: "power3.out", onUpdate: paint });
          const ly = gsap.quickTo(light, "y", { duration: 0.9, ease: "power3.out", onUpdate: paint });
          const ry = gsap.quickTo(book, "rotationY", { duration: 0.9, ease: "power3.out" });
          const rx = gsap.quickTo(book, "rotationX", { duration: 0.9, ease: "power3.out" });
          const lift = gsap.quickTo(book, "y", { duration: 0.9, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            // rect read before any write this frame — no forced layout
            const box = plate.getBoundingClientRect();
            const px = (e.clientX - box.left) / box.width;
            const py = (e.clientY - box.top) / box.height;
            lx(px * 100);
            ly(py * 100);
            ry((px - 0.5) * 22);
            rx((0.5 - py) * 10);
            lift(-12);
          };
          const onLeave = () => {
            lx(50);
            ly(36);
            ry(0);
            rx(0);
            lift(0);
          };
          plate.addEventListener("pointermove", onMove);
          plate.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            plate.removeEventListener("pointermove", onMove);
            plate.removeEventListener("pointerleave", onLeave);
          });
        }
      });

      return () => cleanups.forEach((c) => c());
    });

    return () => mm.revert();
  }, []);

  return null;
}
