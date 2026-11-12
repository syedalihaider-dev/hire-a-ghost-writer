"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./Cursor.module.css";

const INTERACTIVE = "a, button, [data-cursor], input, textarea, label, summary";

/**
 * Desktop-only follower ring + magnetic pull on [data-magnetic] elements.
 * The native cursor is never hidden, so usability is unaffected; touch,
 * coarse pointers and reduced-motion users get nothing at all.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches || !ring.current) return;

    const el = ring.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let magnet: HTMLElement | null = null;
    let shown = false;

    const releaseMagnet = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.dataset.visible = "true";
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement;
      const nextMagnet = target.closest<HTMLElement>("[data-magnetic]");
      if (nextMagnet !== magnet) releaseMagnet();
      if (nextMagnet) {
        magnet = nextMagnet;
        const r = nextMagnet.getBoundingClientRect();
        gsap.to(nextMagnet, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.22,
          y: (e.clientY - (r.top + r.height / 2)) * 0.3,
          duration: 0.5,
          ease: "power3.out",
        });
      }

      const hit = target.closest<HTMLElement>(INTERACTIVE);
      const text = hit?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      el.dataset.state = text ? "label" : hit ? "hover" : "";
      if (label.current && label.current.textContent !== text) label.current.textContent = text;
    };

    const onLeave = () => {
      el.dataset.visible = "";
      shown = false;
      releaseMagnet();
    };
    // Overlays that open under a stationary pointer ask the ring to drop its label.
    const onReset = () => {
      el.dataset.state = "";
      if (label.current) label.current.textContent = "";
    };
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("cursor:reset", onReset);
    return () => {
      window.removeEventListener("cursor:reset", onReset);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={ring} className={styles.cursor} aria-hidden="true">
      <span className={styles.ring} />
      <span ref={label} className={styles.label} />
    </div>
  );
}
