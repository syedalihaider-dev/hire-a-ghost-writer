"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { genres } from "@/content/siteConfig";
import { aboutCraft } from "@/content/aboutContent";
import Link from "@/components/UI/AppLink";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import styles from "./AboutCraft.module.css";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * Typography-led service index. Hover / focus a title and the featured plate
 * wipes to that genre's image while its description sets in. Every title is a
 * real link to its service page; every description is in the HTML.
 */
export default function CraftIndex() {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  const show = (i: number) => {
    if (i === active) return;
    const prev = active;
    setActive(i);
    const el = panel.current;
    if (!el || prefersReducedMotion()) return;
    const imgs = [...el.querySelectorAll<HTMLElement>("[data-craft-img]")];
    const down = i > prev;
    gsap.killTweensOf(imgs);
    imgs.forEach((img, j) => {
      if (j === i) {
        gsap.set(img, { zIndex: 2 });
        gsap.fromTo(img, { clipPath: down ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: EASE.heavy });
        gsap.fromTo(img.firstElementChild, { scale: 1.15 }, { scale: 1, duration: 1.3, ease: EASE.reveal });
      } else gsap.set(img, { zIndex: j === prev ? 1 : 0 });
    });
    gsap.fromTo(el.querySelectorAll("[data-craft-line]"), { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: EASE.reveal, stagger: 0.05, overwrite: true });
  };

  const g = genres[active];

  return (
    <div className={styles.index}>
      <ol role="list" className={styles.list} data-reveal-group="0.05">
        {genres.map((s, i) => (
          <li key={s.slug} className={styles.row} data-reveal-item data-active={i === active || undefined}>
            <Link href={s.href} className={styles.rowLink} onPointerEnter={() => show(i)} onFocus={() => show(i)} data-cursor={aboutCraft.linkLabel}>
              <span className={styles.no}>{pad(i)}</span>
              <h3 className={`display ${styles.name}`}>{s.title}</h3>
              <span className={styles.arrow} aria-hidden="true" />
            </Link>
            <p className={styles.rowText}>{s.description}</p>
          </li>
        ))}
      </ol>

      <div ref={panel} className={styles.panel} aria-hidden="true">
        <div className={styles.plate}>
          {genres.map((s, i) => (
            <div key={s.slug} className={styles.plateImg} data-craft-img style={{ zIndex: i === active ? 2 : 0 }}>
              <div className={styles.plateInner}>
                <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 30vw, 1px" quality={60} style={{ objectFit: "cover" }} />
              </div>
            </div>
          ))}
          <span className={styles.plateNo}>{pad(active)}</span>
        </div>
        <div className={styles.detail}>
          <p className={styles.mask}>
            <span className="label label--accent" data-craft-line>
              {g.label}
            </span>
          </p>
          <p className={styles.mask}>
            <span className={styles.detailText} data-craft-line>
              {g.description}
            </span>
          </p>
          <p className={styles.mask}>
            <span className={styles.detailLink} data-craft-line>
              {aboutCraft.linkLabel} {g.title} &rarr;
            </span>
          </p>
        </div>
      </div>

      <p className={styles.all}>
        <Link href={aboutCraft.allServices.href} className="link-line">
          {aboutCraft.allServices.label}
        </Link>
      </p>
    </div>
  );
}
