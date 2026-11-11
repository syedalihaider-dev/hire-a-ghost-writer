"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { destroyLenis, initLenis, lockScroll } from "@/lib/lenis";
import { onLoaderDone } from "@/lib/loader";
import { sceneState } from "@/lib/sceneState";

/**
 * Boots Lenis (synced to GSAP's ticker), publishes smoothed scroll velocity for
 * velocity-reactive effects, keeps the page locked behind the gate, and
 * refreshes ScrollTrigger once fonts and the gate are done. Renders nothing.
 */
export default function ScrollProvider() {
  useEffect(() => {
    const lenis = initLenis();
    lockScroll(true);

    const onScroll = ({ velocity }: { velocity: number }) => {
      sceneState.velocity = gsap.utils.clamp(-1, 1, velocity / 60);
    };
    lenis?.on("scroll", onScroll);
    // Ease velocity back to rest when scrolling stops.
    const decay = () => {
      sceneState.velocity *= 0.92;
    };
    gsap.ticker.add(decay);

    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const offLoader = onLoaderDone(() => {
      lockScroll(false);
      refresh();
    });

    return () => {
      offLoader();
      gsap.ticker.remove(decay);
      lenis?.off("scroll", onScroll);
      lockScroll(false);
      destroyLenis();
    };
  }, []);

  return null;
}
