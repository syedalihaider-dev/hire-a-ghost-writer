"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import Link from "@/components/UI/AppLink";
import { chapters, genresIntro } from "@/content/homeContent";
import { genres, siteConfig } from "@/content/siteConfig";
import { gsap } from "@/lib/gsap";
import { sound } from "@/lib/audio";
import SectionHead from "@/components/UI/SectionHead";
import { ArrowUpRightIcon, PlusIcon } from "@/components/UI/Icons";
import styles from "./Genres.module.css";

/**
 * 04 — the ten genres as an editorial index. Hover (desktop): the genre image
 * follows the cursor, tilting with velocity and rippling through an SVG
 * displacement filter. Click / tap: the row expands with its description.
 */
export default function Genres() {
  const root = useRef<HTMLElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  useEffect(() => {
    const el = follower.current;
    const section = root.current;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!el || !section || !mq.matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3.out" });
    let lastX = 0;

    const onMove = (e: PointerEvent) => {
      const box = section.getBoundingClientRect();
      xTo(e.clientX - box.left);
      yTo(e.clientY - box.top);
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rTo(gsap.utils.clamp(-12, 12, dx * 0.6));
    };
    section.addEventListener("pointermove", onMove);
    return () => {
      section.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section ref={root} className={`surface-light pad-md ${styles.genres}`} aria-labelledby="genres-title" onPointerLeave={() => setHover(-1)}>
      <div className="container">
        <SectionHead chapter={4} id="genres-title" label={chapters.genres.label} title={chapters.genres.title} lead={genresIntro.text} />

        <ol role="list" className={styles.list}>
          {genres.map((g, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-p${i}`;
            return (
              <li
                key={g.slug}
                className={styles.row}
                data-open={isOpen || undefined}
                data-hover={hover === i || undefined}
                onPointerEnter={() => {
                  setHover(i);
                  sound.tick();
                }}
                data-reveal="up"
              >
                <button type="button" className={styles.head} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? null : i)} data-cursor="Open">
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.name}>{g.label}</span>
                  <span className={styles.service}>{g.title}</span>
                  <span className={styles.toggle} aria-hidden="true">
                    <PlusIcon size={18} />
                  </span>
                </button>
                <div id={panelId} className={styles.panel} role="region" aria-label={g.title}>
                  <div className={styles.panelInner} inert={!isOpen}>
                    <div className={styles.thumb}>
                      <Image src={g.image} alt={g.imageAlt} fill sizes="240px" quality={75} />
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

      <div ref={follower} className={styles.follower} data-visible={hover >= 0 || undefined} aria-hidden="true">
        {genres.map((g, i) => (
          <div key={g.slug} className={styles.followerImg} data-active={i === hover || undefined}>
            <Image src={g.image} alt="" fill sizes="280px" quality={75} />
          </div>
        ))}
      </div>
    </section>
  );
}
