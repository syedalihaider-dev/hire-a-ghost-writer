"use client";

/**
 * Reveal primitives — the site's single text / image animation language.
 * Both the declarative layer (ScrollEffects, data-reveal="…") and bespoke
 * section timelines (Hero, Portfolio, Contact) build from these, so every
 * heading, paragraph and image enters the same way everywhere.
 *
 *   chars  — main headings: masked lines, characters rise with a slight 3D tip
 *   words  — secondary headings: words slide + fade
 *   lines  — paragraphs: masked line reveal (never per character)
 *   image  — clip-path wipe + inner image settles from 1.08 → 1
 *
 * Every split is reverted on completion so the DOM returns to plain,
 * crawlable text and later resizes re-wrap naturally.
 */
import { gsap, SplitText } from "./gsap";
import { DUR, EASE } from "./motion";

type Opts = { delay?: number; duration?: number };

/** Shown before splitting, so text never flashes in its unsplit state. */
const show = (el: Element) => gsap.set(el, { autoAlpha: 1 });

export function revealChars(el: HTMLElement, { delay = 0, duration = 1.05 }: Opts = {}) {
  const split = SplitText.create(el, { type: "lines,words,chars", mask: "lines", linesClass: "split-line" });
  show(el);
  return gsap.from(split.chars, {
    yPercent: 115,
    rotationX: -70,
    transformOrigin: "50% 100%",
    transformPerspective: 600,
    duration,
    ease: EASE.reveal,
    stagger: { each: 0.018, from: "start" },
    delay,
    onComplete: () => split.revert(),
  });
}

export function revealWords(el: HTMLElement, { delay = 0, duration = 0.9 }: Opts = {}) {
  const split = SplitText.create(el, { type: "words", mask: "words" });
  show(el);
  return gsap.from(split.words, {
    yPercent: 100,
    autoAlpha: 0,
    duration,
    ease: EASE.reveal,
    stagger: 0.045,
    delay,
    onComplete: () => split.revert(),
  });
}

export function revealLines(el: HTMLElement, { delay = 0, duration = DUR.slow }: Opts = {}) {
  const split = SplitText.create(el, { type: "lines", mask: "lines", aria: "none" });
  show(el);
  return gsap.from(split.lines, {
    yPercent: 100,
    autoAlpha: 0,
    duration,
    ease: EASE.reveal,
    stagger: 0.075,
    delay,
    onComplete: () => split.revert(),
  });
}

/** Clip-path wipe of a frame; its first <img> settles from a slight zoom. */
export function revealImage(el: HTMLElement, { delay = 0, duration = DUR.cinematic, from = "inset(100% 0% 0% 0%)" }: Opts & { from?: string } = {}) {
  const img = el.querySelector("img");
  const tl = gsap.timeline({ delay });
  tl.fromTo(el, { autoAlpha: 1, clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration, ease: EASE.heavy, clearProps: "clipPath" }, 0);
  if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: duration + 0.3, ease: EASE.reveal }, 0);
  return tl;
}

export const REVEALERS = { chars: revealChars, words: revealWords, lines: revealLines, split: revealLines } as const;
export type TextReveal = keyof typeof REVEALERS;
