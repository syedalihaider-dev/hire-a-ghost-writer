"use client";

import { useEffect, useRef, useState } from "react";
import { stories } from "@/content/servicesContent";
import { renderRich } from "@/components/UI/RichTitle";
import { gsap, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import styles from "./Stories.module.css";

const items = stories.items;
const N = items.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Pose of a letter by its depth in the deck (0 = on top). */
const pose = (d: number) =>
  d === 0
    ? { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1 }
    : d < 3
      ? { x: d * 14, y: d * 16, rotation: d % 2 ? 2.4 : -1.8, scale: 1 - d * 0.04, autoAlpha: 1 }
      : { x: 40, y: 48, rotation: 0, scale: 0.88, autoAlpha: 0 };

/**
 * Success stories as a deck of letters on a desk. Next sets the top letter
 * aside (it slides off and returns to the bottom of the pile) and the next
 * one comes forward; previous brings the last letter back on top.
 * Reader-paced — no autoplay. Arrow keys work when the deck has focus.
 */
export default function Stories() {
  const [index, setIndex] = useState(0);
  const deck = useRef<HTMLDivElement>(null);
  const prev = useRef(0);
  const busy = useRef(false);

  // Lay every letter at its depth; animate the change of top letter.
  useEffect(() => {
    const el = deck.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>("[data-letter]")];
    const reduced = window.matchMedia(MQ.reduced).matches;
    const from = prev.current;
    prev.current = index;
    const depth = (i: number) => (i - index + N) % N;

    if (reduced || from === index) {
      cards.forEach((c, i) => gsap.set(c, { ...pose(depth(i)), zIndex: N - depth(i) }));
      return;
    }
    busy.current = true;
    const forward = (from + 1) % N === index;
    const outgoing = cards[from];
    const tl = gsap.timeline({ onComplete: () => void (busy.current = false) });
    cards.forEach((c, i) => {
      if (i === from && forward) return;
      tl.to(c, { ...pose(depth(i)), duration: 0.8, ease: EASE.reveal }, 0.12);
      tl.set(c, { zIndex: N - depth(i) }, depth(i) === 0 && !forward ? 0 : 0.12);
    });
    if (forward) {
      // the top letter is set aside to the left, then slipped under the pile
      tl.to(outgoing, { x: "-112%", y: -20, rotation: -9, duration: 0.55, ease: "power3.in" }, 0)
        .set(outgoing, { zIndex: 0 }, 0.55)
        .to(outgoing, { ...pose(depth(from)), duration: 0.7, ease: EASE.reveal }, 0.6);
    } else {
      gsap.set(cards[index], { zIndex: N + 1, x: "-112%", y: -20, rotation: -9 });
    }
    return () => {
      tl.kill();
    };
  }, [index]);

  const go = (dir: 1 | -1) => {
    if (busy.current) return;
    setIndex((i) => (i + dir + N) % N);
  };

  const active = items[index];

  return (
    <section className={`surface-dark ${styles.stories}`} aria-labelledby="stories-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.head}>
          <p className={styles.mark}>
            <span className={styles.no}>
              <i>&sect;</i> 06
            </span>
            <span className={styles.label}>{stories.label}</span>
          </p>
          <h2 id="stories-title" className={`display ${styles.title}`}>
            {renderRich(stories.title)}
          </h2>
          <p className={styles.intro}>{stories.intro}</p>

          <div className={styles.controls}>
            <button type="button" className={styles.btn} onClick={() => go(-1)} aria-label="Previous testimonial">
              <span className={styles.arrow} data-dir="prev" aria-hidden="true" />
            </button>
            <p className={styles.count} aria-live="polite">
              <span className={styles.countNow}>{pad(index + 1)}</span>
              <span className={styles.countOf}>/ {pad(N)}</span>
              <span className="visually-hidden">
                — {active.name}, {active.role}
              </span>
            </p>
            <button type="button" className={styles.btn} onClick={() => go(1)} aria-label="Next testimonial">
              <span className={styles.arrow} data-dir="next" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={deck}
          className={styles.deck}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          {items.map((t, i) => (
            <figure key={t.name} className={styles.letter} data-letter aria-hidden={i !== index} style={{ zIndex: N - ((i - index + N) % N) }}>
              <span className={styles.letterHead} aria-hidden="true">
                <span>Letter No. {pad(i + 1)}</span>
                <span className={styles.postmark}>HGWN</span>
              </span>
              <blockquote className={styles.quote}>
                <p>{t.quote}</p>
              </blockquote>
              <figcaption className={styles.cite}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.role}>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
