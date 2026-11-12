"use client";

import { gsap } from "@/lib/gsap";

export type BookParts = {
  root: HTMLElement;
  body: HTMLElement;
  cover: HTMLElement;
  sheen: HTMLElement;
  shadow: HTMLElement;
};

export function bookParts(scope: ParentNode): BookParts | null {
  const root = scope.querySelector<HTMLElement>("[data-book]");
  if (!root) return null;
  const $ = (s: string) => root.querySelector<HTMLElement>(s)!;
  return { root, body: $("[data-book-body]"), cover: $("[data-book-cover]"), sheen: $("[data-book-sheen]"), shadow: $("[data-book-shadow]") };
}

/** Slow, weightless hover. The float wrapper and the shadow breathe together. */
export function floatBook(floatEl: HTMLElement, shadow: HTMLElement, amp = 14) {
  const opts = { duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 } as const;
  const a = gsap.to(floatEl, { y: -amp, rotation: 1.2, ...opts });
  const b = gsap.to(shadow, { scale: 0.84, opacity: 0.65, ...opts });
  return () => {
    a.kill();
    b.kill();
  };
}

/**
 * Pointer tilt around a resting pose (fine pointers only). The light sweep on
 * the cover follows the angle, so the foil appears to catch the light.
 */
export function tiltBook(area: HTMLElement, parts: BookParts, rest: { x: number; y: number }, range = { x: 8, y: 16 }) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const rx = gsap.quickTo(parts.body, "rotationX", { duration: 1, ease: "power3.out" });
  const ry = gsap.quickTo(parts.body, "rotationY", { duration: 1, ease: "power3.out" });
  const sx = gsap.quickTo(parts.sheen, "xPercent", { duration: 1.2, ease: "power3.out" });
  const onMove = (e: PointerEvent) => {
    const b = area.getBoundingClientRect();
    const px = ((e.clientX - b.left) / b.width) * 2 - 1;
    const py = ((e.clientY - b.top) / b.height) * 2 - 1;
    ry(rest.y + px * range.y);
    rx(rest.x - py * range.x);
    sx(-110 + (px + 1) * 70);
  };
  const onLeave = () => {
    ry(rest.y);
    rx(rest.x);
    sx(-110);
  };
  area.addEventListener("pointermove", onMove);
  area.addEventListener("pointerleave", onLeave);
  return () => {
    area.removeEventListener("pointermove", onMove);
    area.removeEventListener("pointerleave", onLeave);
  };
}
