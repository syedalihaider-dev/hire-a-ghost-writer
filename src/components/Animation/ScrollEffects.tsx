"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { REVEALERS, revealImage, type TextReveal } from "@/lib/reveal";
import { sceneState } from "@/lib/sceneState";
import { onLoaderDone } from "@/lib/loader";

/**
 * Declarative scroll choreography — server-rendered sections opt in with
 * data attributes and never need to become client components:
 *
 *   data-reveal="chars"                main headings (masked chars, slight 3D tip)
 *   data-reveal="words"                secondary headings (word slide + fade)
 *   data-reveal="lines|split"          paragraphs / long headings (masked lines)
 *   data-reveal="image|clip"           clip-path wipe, inner image 1.08 → 1
 *   data-reveal="up|fade"              simple one-shot entrances
 *   data-reveal-delay="0.2"
 *   data-reveal-group + data-reveal-item  staggered children
 *   data-parallax="10"                 scrubbed yPercent drift (±value)
 *   data-parallax-bg                   cover image drifting inside its section
 *   data-count="10" [data-decimals]    counts up when revealed (width locked → no CLS)
 *   data-fill                          outlined numeral fills with gold (one-shot)
 *   data-drift="-30"                   oversized type drifts sideways (scrub, transform only)
 *   data-marquee="1|-1"                endless marquee whose speed follows scroll velocity
 *
 * Every scrubbed effect is reversible. All of it lives inside one
 * gsap.matchMedia so reduced-motion users get static content.
 * Rendered at the END of the page so it runs after every section hydrated.
 */
export default function ScrollEffects() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    let cancelled = false;

    const build = () => {
      if (cancelled) return;

      mm.add(MQ.motion, () => {
        const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel);
        const delayOf = (el: HTMLElement) => parseFloat(el.dataset.revealDelay ?? "0") || 0;
        const once = (trigger: Element, start = "top 86%") => ({ trigger, start, once: true });

        q('[data-reveal="up"]').forEach((el) =>
          gsap.fromTo(el, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: DUR.slow, ease: EASE.reveal, delay: delayOf(el), scrollTrigger: once(el) }),
        );

        q('[data-reveal="fade"]').forEach((el) =>
          gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR.slow, delay: delayOf(el), scrollTrigger: once(el) }),
        );

        q('[data-reveal="image"], [data-reveal="clip"]').forEach((el) => {
          gsap.set(el, { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" });
          ScrollTrigger.create({ ...once(el, "top 90%"), onEnter: () => revealImage(el, { delay: delayOf(el) }) });
        });

        // Text is split lazily, only as each element arrives — splitting everything
        // up front would force a layout pass per heading during load.
        q("[data-reveal]").forEach((el) => {
          const kind = el.dataset.reveal as TextReveal;
          const run = REVEALERS[kind];
          if (!run) return;
          ScrollTrigger.create({ ...once(el, "top 90%"), onEnter: () => run(el, { delay: delayOf(el) }) });
        });

        q("[data-reveal-group]").forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>(":scope > [data-reveal-item]");
          if (!items.length) return;
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: DUR.slow, ease: EASE.reveal, stagger: parseFloat(group.dataset.revealGroup || "") || STAGGER.items, scrollTrigger: once(group) },
          );
        });

        q("[data-parallax]").forEach((el) => {
          const amount = parseFloat(el.dataset.parallax || "10");
          gsap.fromTo(el, { yPercent: -amount }, { yPercent: amount, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
        });

        // Cover imagery: the layer is taller than its section and drifts through it.
        q("[data-parallax-bg]").forEach((el) =>
          gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } }),
        );

        // Lock each counter to its final width first (one batched read), so counting
        // from 0 never re-wraps neighbouring text (was the Pricing CLS source).
        const counters = q("[data-count]");
        const widths = counters.map((el) => el.getBoundingClientRect().width);
        counters.forEach((el, i) => {
          el.style.display = "inline-block";
          el.style.minWidth = `${Math.ceil(widths[i])}px`;
          el.style.fontVariantNumeric = "tabular-nums";
          const target = parseFloat(el.dataset.count || "0");
          const decimals = parseInt(el.dataset.decimals || "0", 10);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: DUR.cinematic,
            ease: "power2.out",
            scrollTrigger: once(el, "top 90%"),
            onUpdate: () => (el.firstChild ? (el.firstChild.textContent = obj.v.toFixed(decimals)) : (el.textContent = obj.v.toFixed(decimals))),
          });
        });

        // One-shot fill (not scrubbed: animating text fills per frame forces repaints).
        q("[data-fill]").forEach((el) =>
          gsap.fromTo(el, { "--fill": "0%" }, { "--fill": "100%", duration: DUR.cinematic, ease: "power2.inOut", scrollTrigger: once(el, "top 75%") }),
        );

        // Horizontal drift for oversized type — transform only.
        q("[data-drift]").forEach((el) =>
          gsap.fromTo(el, { xPercent: 0 }, { xPercent: parseFloat(el.dataset.drift || "-20"), ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 } }),
        );

        // Velocity-reactive marquees — only tick while on screen. Widths are measured
        // on refresh, never inside the ticker (reading scrollWidth after writing a
        // transform each frame forced a synchronous layout per marquee per frame).
        const marquees = q("[data-marquee]").map((el) => {
          const m = { el, dir: parseFloat(el.dataset.marquee || "1"), x: 0, on: false, half: el.scrollWidth / 2 };
          ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (self) => (m.on = self.isActive) });
          return m;
        });
        const measure = () => marquees.forEach((m) => (m.half = m.el.scrollWidth / 2));
        ScrollTrigger.addEventListener("refresh", measure);
        const tick = () => {
          const v = sceneState.velocity;
          for (const m of marquees) {
            if (!m.on || !m.half) continue;
            m.x -= (0.6 + Math.abs(v) * 12) * m.dir * (v < -0.02 ? -1 : 1);
            if (m.x <= -m.half) m.x += m.half;
            if (m.x > 0) m.x -= m.half;
            m.el.style.transform = `translate3d(${m.x.toFixed(2)}px,0,0) skewX(${(v * -4).toFixed(2)}deg)`;
          }
        };
        if (marquees.length) gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          ScrollTrigger.removeEventListener("refresh", measure);
        };
      });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    // Build after the preloader, when the main thread is idle — keeps it off the load path.
    const off = onLoaderDone(() => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
      ric(build, { timeout: 600 });
    });

    return () => {
      cancelled = true;
      off();
      mm.revert();
    };
  }, []);

  return null;
}
