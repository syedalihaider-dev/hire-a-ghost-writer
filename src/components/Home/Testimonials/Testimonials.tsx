"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { chapters, CHAPTER_NO, testimonials, TOTAL_CHAPTERS } from "@/content/homeContent";
import { gsap, SplitText } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import styles from "./Testimonials.module.css";

const { items } = testimonials;
const pad = (n: number) => String(n).padStart(2, "0");
const INTERVAL = 9; // seconds — long enough to read every quote

// Burgundy duotones of the genre photography, matched to each client's book type.
const IMAGES = ["memoir", "business", "non-fiction", "fiction", "autobiography", "academic", "childrens", "publishing"];

/**
 * 10 — one dominant testimonial at a time. Quote lines mask out/in, the
 * client name staggers, the duotone image mask-reveals and the progress
 * hairline fills. Autoplay pauses on hover/focus, off-screen, and never runs
 * under reduced motion.
 */
export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const current = useRef(0);
  const busy = useRef(false);
  const progress = useRef<gsap.core.Tween | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const visible = useRef(false);

  const q = (sel: string) => root.current!.querySelector<HTMLElement>(sel)!;

  const show = (next: number) => {
    const el = root.current;
    if (!el || busy.current) return;
    const prev = current.current;
    next = (next + items.length) % items.length;
    if (next === prev) return;
    busy.current = true;
    current.current = next;
    setIndex(next);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prevSlide = q(`[data-slide="${prev}"]`);
    const nextSlide = q(`[data-slide="${next}"]`);
    const prevImg = q(`[data-img="${prev}"]`);
    const nextImg = q(`[data-img="${next}"]`);

    if (reduce) {
      gsap.set([prevSlide, prevImg], { autoAlpha: 0 });
      gsap.set([nextSlide, nextImg], { autoAlpha: 1 });
      busy.current = false;
      return;
    }

    const outLines = SplitText.create(prevSlide.querySelector("[data-quote]"), { type: "lines", mask: "lines", aria: "none" });
    const tl = gsap.timeline({
      onComplete: () => {
        outLines.revert();
        busy.current = false;
      },
    });
    tl.to(outLines.lines, { yPercent: -105, duration: 0.55, ease: "power3.in", stagger: 0.04 }, 0)
      .to(prevSlide.querySelectorAll("[data-meta]"), { autoAlpha: 0, y: -12, duration: 0.35 }, 0)
      .set(prevSlide, { autoAlpha: 0 })
      .set(nextSlide, { autoAlpha: 1 })
      .add(() => {
        const inLines = SplitText.create(nextSlide.querySelector("[data-quote]"), { type: "lines", mask: "lines", aria: "none" });
        const name = SplitText.create(nextSlide.querySelector("[data-name]"), { type: "chars", aria: "none" });
        gsap
          .timeline({ onComplete: () => (inLines.revert(), name.revert()) })
          .from(inLines.lines, { yPercent: 105, duration: 0.9, ease: EASE.reveal, stagger: 0.07 })
          .fromTo(nextSlide.querySelectorAll("[data-meta]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.reveal }, 0.3)
          .from(name.chars, { autoAlpha: 0, yPercent: 60, duration: 0.5, ease: EASE.reveal, stagger: 0.02 }, 0.35);
      });

    gsap.set(nextImg, { autoAlpha: 1, zIndex: 2 });
    gsap.set(prevImg, { zIndex: 1 });
    gsap.fromTo(nextImg, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EASE.heavy, delay: 0.2 });
    gsap.fromTo(nextImg.querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 1.6, ease: EASE.reveal, delay: 0.2 });
    gsap.to(prevImg.querySelector("img"), { scale: 0.96, duration: 1.2, ease: EASE.transition, onComplete: () => gsap.set(prevImg, { autoAlpha: 0 }) });
    restartProgress();
  };

  const restartProgress = () => {
    progress.current?.kill();
    const fill = root.current?.querySelector<HTMLElement>("[data-progress]");
    if (!fill) return;
    gsap.set(fill, { scaleX: 0 });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    progress.current = gsap.to(fill, {
      scaleX: 1,
      duration: INTERVAL,
      ease: "none",
      paused: pausedRef.current || !visible.current,
      onComplete: () => show(current.current + 1),
    });
  };

  // Autoplay only while visible; stopped entirely for reduced motion.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    items.forEach((_, i) => {
      if (i === 0) return;
      gsap.set([q(`[data-slide="${i}"]`), q(`[data-img="${i}"]`)], { autoAlpha: 0 });
    });
    restartProgress();
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting && !pausedRef.current) progress.current?.play();
      else progress.current?.pause();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      progress.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPause = (p: boolean) => {
    pausedRef.current = p;
    setPaused(p);
    if (p) progress.current?.pause();
    else if (visible.current) progress.current?.play();
  };

  return (
    <section
      ref={root}
      className={styles.testimonials}
      aria-labelledby="testimonials-title"
      aria-roledescription="carousel"
      onPointerEnter={() => progress.current?.pause()}
      onPointerLeave={() => !pausedRef.current && visible.current && progress.current?.play()}
      onFocusCapture={() => progress.current?.pause()}
    >
      <div className={`container ${styles.grid}`}>
        <header className={styles.head}>
          <div className={styles.meta}>
            <span className="label label--accent">{chapters.testimonials.label}</span>
            <span className="label">
              {pad(CHAPTER_NO.testimonials)} / {pad(TOTAL_CHAPTERS)}
            </span>
          </div>
          <h2 id="testimonials-title" className={`serif ${styles.title}`}>
            {testimonials.title}
          </h2>
          <p className={styles.sub}>{testimonials.text}</p>
        </header>

        <div className={styles.visual} aria-hidden="true">
          {items.map((t, i) => (
            <div key={t.name} className={styles.img} data-img={i}>
              <Image src={`/images/testimonials/${IMAGES[i]}.jpg`} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" quality={75} />
            </div>
          ))}
          <span className={styles.glyph}>&ldquo;</span>
        </div>

        <div className={styles.stage}>
          {items.map((t, i) => (
            <div
              key={t.name}
              className={styles.slide}
              data-slide={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={i !== index}
            >
              <figure className={styles.figure}>
              <p className={styles.stars} data-meta>
                <span aria-hidden="true">★★★★★</span>
                <span className="visually-hidden">Rated 5 out of 5</span>
              </p>
              <blockquote className={`serif ${styles.quote}`}>
                <p data-quote>{t.quote}</p>
              </blockquote>
              <figcaption className={styles.cite}>
                <span className={styles.name} data-name>
                  {t.name}
                </span>
                <span className="label label--accent" data-meta>
                  {t.service}
                </span>
              </figcaption>
              </figure>
            </div>
          ))}

          <div className={styles.controls}>
            <span className={styles.count} aria-live="polite">
              <span className="visually-hidden">Testimonial </span>
              {pad(index + 1)} <i>/ {pad(items.length)}</i>
            </span>
            <span className={styles.track} aria-hidden="true">
              <span className={styles.fill} data-progress />
            </span>
            <button type="button" className={styles.btn} onClick={() => show(current.current - 1)} aria-label="Previous testimonial" data-magnetic>
              ←
            </button>
            <button type="button" className={styles.btn} onClick={() => show(current.current + 1)} aria-label="Next testimonial" data-magnetic>
              →
            </button>
            <button type="button" className={`label ${styles.pause}`} onClick={() => setPause(!paused)} aria-pressed={paused}>
              {paused ? "Play" : "Pause"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
