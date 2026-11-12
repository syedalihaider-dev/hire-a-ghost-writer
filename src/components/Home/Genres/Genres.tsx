"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import Link from "@/components/UI/AppLink";
import { chapters, genresIntro } from "@/content/homeContent";
import { genres, siteConfig } from "@/content/siteConfig";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sound } from "@/lib/audio";
import SectionHead from "@/components/UI/SectionHead";
import { ArrowUpRightIcon, PlusIcon } from "@/components/UI/Icons";
import styles from "./Genres.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const FINE = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * 04 — the ten genres as an editorial index.
 *
 * Desktop hover: a print floats beside the cursor in 3D space — it trails the
 * pointer, leans into the direction of travel, and sits on a gold-ruled
 * backplate at a different depth. Changing rows wipes the next print in from
 * the direction you moved while the previous one wipes out; the rest of the
 * index dims so the active genre reads as a single line of type.
 * Click / tap (all devices): the row expands with its description and link,
 * so every word of content is in the HTML and reachable without hover.
 */
export default function Genres() {
  const root = useRef<HTMLElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const tagNo = useRef<HTMLSpanElement>(null);
  const tagName = useRef<HTMLSpanElement>(null);
  const active = useRef(-1);
  const enabled = useRef(false);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  const card = (i: number) => follower.current?.querySelector<HTMLElement>(`[data-card="${i}"]`) ?? null;

  const activate = (next: number) => {
    setHover(next);
    if (!enabled.current || next === active.current) return;
    const prev = active.current;
    active.current = next;
    const el = follower.current!;
    const down = prev === -1 || next > prev;

    if (prev === -1) gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out", overwrite: "auto" });

    const inCard = card(next);
    const outCard = prev >= 0 ? card(prev) : null;
    if (outCard) {
      gsap.set(outCard, { zIndex: 1 });
      gsap.to(outCard, { clipPath: down ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)", duration: 0.65, ease: "power3.inOut", overwrite: true });
      gsap.to(outCard.querySelector("img"), { scale: 1.12, yPercent: down ? -8 : 8, duration: 0.65, ease: "power3.inOut", overwrite: true });
    }
    if (inCard) {
      gsap.set(inCard, { zIndex: 2 });
      gsap.fromTo(inCard, { clipPath: down ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.out", overwrite: true });
      gsap.fromTo(inCard.querySelector("img"), { scale: 1.3, yPercent: down ? 10 : -10 }, { scale: 1, yPercent: 0, duration: 1.1, ease: "expo.out", overwrite: true });
    }

    // caption: roll the new label in
    if (tagNo.current && tagName.current) {
      const tag = [tagNo.current, tagName.current];
      gsap.to(tag, {
        yPercent: down ? -100 : 100,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          tagNo.current!.textContent = `${pad(next + 1)} / ${pad(genres.length)}`;
          tagName.current!.textContent = genres[next].label;
          gsap.fromTo(tag, { yPercent: down ? 100 : -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out", stagger: 0.05 });
        },
      });
    }
  };

  const deactivate = () => {
    setHover(-1);
    if (!enabled.current || active.current === -1) return;
    const prev = card(active.current);
    active.current = -1;
    gsap.to(follower.current, { autoAlpha: 0, scale: 0.7, duration: 0.45, ease: "power3.in", overwrite: "auto" });
    if (prev) gsap.to(prev, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, ease: "power3.in", delay: 0.05 });
  };

  // Pointer tracking + depth (desktop, fine pointer, motion allowed).
  useEffect(() => {
    const el = follower.current;
    const t = tilt.current;
    const section = root.current;
    if (!el || !t || !section || !window.matchMedia(FINE).matches) return;
    enabled.current = true;

    gsap.set(el, { autoAlpha: 0, scale: 0.7 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const ry = gsap.quickTo(t, "rotationY", { duration: 0.9, ease: "power3.out" });
    const rx = gsap.quickTo(t, "rotationX", { duration: 0.9, ease: "power3.out" });
    const rz = gsap.quickTo(t, "rotation", { duration: 0.9, ease: "power3.out" });
    let lastX = 0;
    let lastY = 0;
    let idle = 0;
    // measured once (and on resize) — never inside pointermove
    let w = el.offsetWidth;
    let h = el.offsetHeight;
    const onResize = () => ((w = el.offsetWidth), (h = el.offsetHeight));
    window.addEventListener("resize", onResize);
    const clamp = gsap.utils.clamp;

    const onMove = (e: PointerEvent) => {
      // sit to the right of the cursor; flip left near the viewport edge
      const right = e.clientX + 48 + w < window.innerWidth - 24;
      xTo(right ? e.clientX + 48 : e.clientX - 48 - w);
      yTo(clamp(16, window.innerHeight - h - 16, e.clientY - h * 0.5));
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      ry(clamp(-20, 20, dx * 0.9));
      rx(clamp(-14, 14, -dy * 0.7));
      rz(clamp(-5, 5, dx * 0.2));
      window.clearTimeout(idle);
      idle = window.setTimeout(() => (ry(0), rx(0), rz(0)), 90);
    };
    section.addEventListener("pointermove", onMove);

    // Scrolling away with a still mouse never fires pointerleave — hide explicitly.
    const st = ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onLeave: () => deactivate(), onLeaveBack: () => deactivate() });

    return () => {
      enabled.current = false;
      window.clearTimeout(idle);
      window.removeEventListener("resize", onResize);
      section.removeEventListener("pointermove", onMove);
      st.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={root} className={`surface-light pad-md ${styles.genres}`} aria-labelledby="genres-title" onPointerLeave={deactivate}>
      <div className="container">
        <SectionHead chapter={4} id="genres-title" label={chapters.genres.label} title={chapters.genres.title} lead={genresIntro.text} />

        <ol role="list" className={styles.list} data-active={hover >= 0 || undefined}>
          {genres.map((g, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-p${i}`;
            return (
              <li
                key={g.slug}
                className={styles.row}
                data-open={isOpen || undefined}
                data-hover={hover === i || undefined}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  activate(i);
                  sound.tick();
                }}
                data-reveal="up"
              >
                <button type="button" className={styles.head} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : i)} data-cursor="Open">
                  <span className={`label ${styles.no}`}>{pad(i + 1)}</span>
                  <span className={styles.name}>
                    <span className={styles.nameText}>{g.label}</span>
                  </span>
                  <span className={styles.service}>{g.title}</span>
                  <span className={styles.toggle} aria-hidden="true">
                    <PlusIcon size={18} />
                  </span>
                </button>
                <div id={panelId} className={styles.panel} role="region" aria-label={g.title}>
                  <div className={styles.panelInner} inert={!isOpen}>
                    <div className={styles.thumb}>
                      <Image src={g.image} alt={g.imageAlt} fill sizes="(min-width: 1024px) 160px, 140px" quality={75} />
                    </div>
                    <p className={styles.text}>{g.description}</p>
                    <Link href={g.href} className={styles.link}>
                      <span className="link-line">{siteConfig.cta.consult.label}</span>
                      <ArrowUpRightIcon size={16} />
                      <span className="visually-hidden"> about {g.title}</span>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div ref={follower} className={styles.follower} aria-hidden="true">
        <div ref={tilt} className={styles.tilt}>
          <span className={styles.backplate} />
          <div className={styles.prints}>
            {genres.map((g, i) => (
              <div key={g.slug} className={styles.print} data-card={i}>
                <Image src={g.image} alt="" fill sizes="280px" quality={75} />
              </div>
            ))}
            <span className={styles.gloss} />
          </div>
          <p className={styles.tag}>
            <span className={styles.tagClip}>
              <span ref={tagNo} className={styles.tagNo}>
                01 / {pad(genres.length)}
              </span>
            </span>
            <span className={styles.tagClip}>
              <span ref={tagName} className={styles.tagName}>
                {genres[0].label}
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
