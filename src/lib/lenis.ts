"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

/**
 * Lenis singleton driven by GSAP's ticker so Lenis and ScrollTrigger share one
 * RAF loop and never drift. Reduced-motion users keep native scrolling.
 */
let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export function initLenis() {
  if (lenis || prefersReducedMotion()) return lenis;

  lenis = new Lenis({
    // Slightly longer glide than the default; touch keeps native momentum
    // (syncTouch off) — smoothing touch on phones feels laggy and costs frames.
    lerp: 0.085,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    autoRaf: false,
    anchors: { offset: -72 },
    // Scrollable overlays (menu, quote drawer) scroll natively.
    prevent: (node: HTMLElement) => !!node.closest?.('[data-lenis-prevent], [aria-modal="true"]'),
  });

  lenis.on("scroll", ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

export const getLenis = () => lenis;

/** Lock / unlock page scroll (menus, drawers, preloader). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (typeof el === "number") window.scrollTo({ top: el + offset });
  else el?.scrollIntoView({ block: "start" });
}
