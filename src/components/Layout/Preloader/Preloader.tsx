"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { markLoaderDone } from "@/lib/loader";
import { siteConfig } from "@/content/siteConfig";
import styles from "./Preloader.module.css";

const SESSION_KEY = "hagwn:visited";
const MAX_WAIT = 2500;

/** Waits only for what the first fold genuinely needs: fonts + the hero photograph. */
function critical(): Promise<unknown>[] {
  const tasks: Promise<unknown>[] = [];
  if (document.fonts?.ready) tasks.push(document.fonts.ready);
  const img = document.querySelector<HTMLImageElement>("[data-hero-image] img");
  if (img && !img.complete) {
    tasks.push(new Promise((r) => {
      img.addEventListener("load", r, { once: true });
      img.addEventListener("error", r, { once: true });
    }));
  }
  return tasks;
}

/**
 * Short, brand-focused preloader: the logo reveals, a hairline tracks real
 * loading, then a single curtain lifts onto the hero. No click required,
 * never longer than 2.5s; returning visitors see ~0.3s.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      el.dataset.controlled = "true";
      const others = ["main-content", "site-header"].map((id) => document.getElementById(id));
      others.forEach((o) => o && (o.inert = true));

      let returning = false;
      try {
        returning = sessionStorage.getItem(SESSION_KEY) === "1";
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* storage blocked */
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const progress = { v: 0 };
      const bar = el.querySelector<HTMLElement>(`.${styles.bar}`);
      const render = () => bar && (bar.style.transform = `scaleX(${progress.v})`);

      const intro = gsap.timeline();
      if (!reduce) {
        intro
          .fromTo(`.${styles.logo}`, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: EASE.transition })
          .from(`.${styles.meta}`, { autoAlpha: 0, y: 8, duration: 0.5 }, "-=0.4");
      }
      const creep = gsap.to(progress, { v: 0.85, duration: 1.6, ease: "power2.out", onUpdate: render });

      const minTime = reduce || returning ? 150 : 450;
      Promise.race([Promise.all([...critical(), new Promise((r) => setTimeout(r, minTime))]), new Promise((r) => setTimeout(r, MAX_WAIT))]).then(() => {
        creep.kill();
        others.forEach((o) => o && (o.inert = false));
        gsap
          .timeline({ onComplete: () => (el.style.display = "none") })
          .to(progress, { v: 1, duration: 0.2, ease: "power2.out", onUpdate: render })
          .to(`.${styles.inner}`, { autoAlpha: 0, y: -12, duration: reduce ? 0.15 : 0.3, ease: EASE.transition }, "-=0.05")
          .to(el, { yPercent: -100, duration: reduce ? 0.2 : 0.8, ease: EASE.heavy }, "-=0.15")
          .add(() => markLoaderDone(), reduce ? 0 : "-=0.65");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.preloader} aria-hidden="true">
      <div className={styles.inner}>
        <Image src={siteConfig.brand.logo.reversed.src} alt="" width={260} height={68} className={styles.logo} priority sizes="260px" />
        <div className={styles.meta}>
          <span className={styles.track}>
            <span className={styles.bar} />
          </span>
          <span className="label">Professional Ghostwriting</span>
        </div>
      </div>
      <span className={styles.edge} />
    </div>
  );
}
