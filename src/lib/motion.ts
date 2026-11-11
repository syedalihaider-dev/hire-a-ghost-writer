/**
 * Motion tokens — the only durations, eases and staggers used in the site.
 * CSS mirrors these as --dur-* / --ease-* custom properties.
 */
import { gsap } from "./gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") gsap.registerPlugin(CustomEase);

export const DUR = { fast: 0.3, base: 0.6, slow: 1.2, cinematic: 1.8, roll: 0.5, slice: 0.9 } as const;

export const STAGGER = { chars: 0.02, lines: 0.08, items: 0.12 } as const;

let created = false;
/** Custom eases are created lazily (client only). */
function ensureEases() {
  if (created || typeof window === "undefined") return;
  created = true;
  CustomEase.create("roll", "0.76,0,0.24,1");
  CustomEase.create("heavy", "M0,0 C0.7,0 0.12,1 1,1");
  CustomEase.create("page", "M0,0 C0.45,0 0.15,1 1,1");
}

export const EASE = {
  get reveal() {
    return "expo.out";
  },
  get transition() {
    return "power3.inOut";
  },
  get roll() {
    ensureEases();
    return "roll";
  },
  get heavy() {
    ensureEases();
    return "heavy";
  },
  get page() {
    ensureEases();
    return "page";
  },
};
