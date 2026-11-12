"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import styles from "./AboutTrust.module.css";

type Item = { quote: string; name: string; service: string };

/**
 * One testimonial at a time, set like a page of prose; a ledger of names
 * turns to the next. Quote lines slide out of their masks and the new one
 * sets in — no autoplay, the reader is in control.
 */
export default function TrustQuotes({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const turn = (i: number) => {
    if (i === active || busy.current) return;
    const el = stage.current;
    if (!el || prefersReducedMotion()) return setActive(i);
    busy.current = true;
    gsap.to(el.querySelectorAll("[data-q-line]"), {
      yPercent: -105,
      duration: 0.45,
      ease: "power3.in",
      stagger: 0.04,
      onComplete: () => {
        setActive(i);
        requestAnimationFrame(() => {
          gsap.fromTo(
            el.querySelectorAll("[data-q-line]"),
            { yPercent: 105 },
            { yPercent: 0, duration: 0.9, ease: EASE.reveal, stagger: 0.06, onComplete: () => void (busy.current = false) },
          );
        });
      },
    });
  };

  const q = items[active];

  return (
    <div className={styles.quotes}>
      <div ref={stage} className={styles.stage} aria-live="polite">
        <span className={styles.quoteMark} aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className={styles.quote}>
          <p className={styles.mask}>
            <span data-q-line className={`serif ${styles.quoteText}`}>
              {q.quote}
            </span>
          </p>
          <footer className={styles.cite}>
            <span className={styles.mask}>
              <span data-q-line className={styles.citeName}>
                {q.name}
              </span>
            </span>
            <span className={styles.mask}>
              <span data-q-line className="label">
                {q.service}
              </span>
            </span>
          </footer>
        </blockquote>
      </div>

      <ol role="list" className={styles.names} aria-label="Choose a testimonial">
        {items.map((it, i) => (
          <li key={it.name}>
            <button type="button" className={styles.nameBtn} aria-pressed={i === active} onClick={() => turn(i)}>
              <span className={styles.nameNo}>{String(i + 1).padStart(2, "0")}</span>
              <span>{it.name}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
