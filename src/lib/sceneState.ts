/**
 * Mutable values written by GSAP/ScrollTrigger in the DOM and read every frame
 * by the WebGL scenes — no React re-renders on scroll.
 */
export const sceneState = {
  /** 0 → 1 once the gate opens (drives scene intros) */
  intro: 0,
  /** smoothed scroll velocity, roughly −1…1 */
  velocity: 0,
  hero: { progress: 0 },
  services: { index: 0, progress: 0, count: 8 },
  showcase: { progress: 0, hovered: -1 },
  contact: { progress: 0 },
};
