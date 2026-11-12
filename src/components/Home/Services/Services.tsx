"use client";

import Image from "next/image";
import { useRef } from "react";
import { chapters, supporting } from "@/content/homeContent";
import { PLACEHOLDER_TAG, supportingServices } from "@/content/siteConfig";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { sound } from "@/lib/audio";
import SectionHead from "@/components/UI/SectionHead";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./Services.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const total = supportingServices.length;

/**
 * 03 — services as chapters. Desktop: a pinned three-zone composition where
 * scroll changes the active service via GSAP timelines (no React state on
 * scroll). Mobile / reduced motion: the same markup flows as stacked chapters.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const el = stage.current!;
        el.dataset.pinned = "true";
        const q = (i: number, part: string) => el.querySelector<HTMLElement>(`[data-svc="${i}"] [data-part="${part}"]`)!;
        const parts = ["num", "left", "media", "right"];
        let current = 0;

        const setNear = (i: number) =>
          el.querySelectorAll<HTMLElement>("[data-svc]").forEach((a) => {
            const n = Number(a.dataset.svc);
            a.toggleAttribute("data-near", Math.abs(n - i) <= 1);
            a.toggleAttribute("data-active", n === i);
          });

        // initial state: only the first service visible
        supportingServices.forEach((_, i) => {
          if (i === 0) return;
          parts.forEach((p) => gsap.set(q(i, p), { autoAlpha: 0 }));
        });
        setNear(0);

        const go = (next: number) => {
          if (next === current) return;
          const prev = current;
          const dir = next > prev ? 1 : -1;
          current = next;
          setNear(next);
          sound.pageFlip(0.5);

          const out = gsap.timeline({ defaults: { overwrite: "auto" } });
          out
            .to(q(prev, "media"), { autoAlpha: 0, scale: 0.94, duration: 0.8, ease: EASE.transition }, 0)
            .to([q(prev, "left"), q(prev, "right")], { autoAlpha: 0, y: -36 * dir, duration: 0.45, ease: "power2.in" }, 0)
            .to(q(prev, "num"), { yPercent: -100 * dir, duration: 0.6, ease: EASE.transition }, 0)
            .set([q(prev, "num")], { autoAlpha: 0 });

          const media = q(next, "media");
          const nextText = [q(next, "left"), q(next, "right")].flatMap((n) => [...n.children]);
          gsap
            .timeline({ defaults: { overwrite: "auto" } })
            .set([media, q(next, "left"), q(next, "right"), q(next, "num")], { autoAlpha: 1, y: 0 })
            .fromTo(media, { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", scale: 1 }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: EASE.heavy }, 0.1)
            .fromTo(media.querySelector("img"), { scale: 1.16 }, { scale: 1, duration: 1.5, ease: EASE.reveal }, 0.1)
            .fromTo(q(next, "num"), { yPercent: 100 * dir }, { yPercent: 0, duration: 0.8, ease: EASE.reveal }, 0.15)
            .fromTo(nextText, { autoAlpha: 0, y: 34 * dir }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.reveal, stagger: 0.06 }, 0.3);
        };

        const fill = el.querySelector<HTMLElement>("[data-svc-fill]");
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.8 * (total - 1)}`,
          pin: true,
          // Transform pinning: switching the stage to position:fixed was scored by
          // Chrome as a full-viewport layout shift (CLS ≈ 1 at pin start and end).
          // Lenis drives scroll + ScrollTrigger.update in the same GSAP tick, so a
          // transform pin stays perfectly in sync on desktop.
          pinType: "transform",
          onUpdate: (self) => {
            if (fill) fill.style.transform = `scaleX(${self.progress})`;
            go(Math.min(total - 1, Math.floor(self.progress * total)));
          },
        });

        return () => {
          delete el.dataset.pinned;
          el.querySelectorAll("[data-svc]").forEach((a) => {
            a.removeAttribute("data-near");
            a.removeAttribute("data-active");
          });
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`surface-dark ${styles.services}`} aria-labelledby="services-title">
      <div className="container pad-md">
        <SectionHead chapter={3} id="services-title" label={chapters.services.label} title={chapters.services.title} lead={supporting.text} />
      </div>

      <div ref={stage} className={styles.stage}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.topbar} aria-hidden="true">
            <span className="label label--accent">Services</span>
            <span className={styles.track}>
              <span className={styles.fill} data-svc-fill />
            </span>
            <span className="label">{pad(total)} Chapters</span>
          </div>

          {supportingServices.map((s, i) => (
            <article key={s.title} className={styles.service} data-svc={i} aria-labelledby={`service-${i}`}>
              <div className={styles.numMask} aria-hidden="true">
                <p className={styles.num} data-part="num">
                  <span>{pad(i + 1)}</span>
                  <small>/{pad(total)}</small>
                </p>
              </div>

              <div className={styles.left} data-part="left">
                <p className="label label--accent">Chapter {pad(i + 1)}</p>
                <h3 id={`service-${i}`} className={`serif ${styles.title}`}>
                  {s.title}
                </h3>
              </div>

              <div className={styles.media} data-part="media" data-svc-media>
                <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" quality={75} style={{ objectPosition: s.focal }} />
              </div>

              <div className={styles.right} data-part="right">
                <p className={styles.desc}>{s.description}</p>
                {/* Placeholder tags stay in the data (to be filled in) but are never shown. */}
                {s.included.some((t) => t !== PLACEHOLDER_TAG) && (
                  <>
                    <p className="label">What&rsquo;s included</p>
                    <ul role="list" className={styles.tags}>
                      {s.included
                        .filter((tag) => tag !== PLACEHOLDER_TAG)
                        .map((tag) => (
                          <li key={tag} className={styles.tag}>
                            {tag}
                          </li>
                        ))}
                    </ul>
                  </>
                )}
                <QuoteButton variant="outline" prefill={`I'm interested in ${s.title}.`}>
                  Get A Quote<span className="visually-hidden"> for {s.title}</span>
                </QuoteButton>
              </div>
            </article>
          ))}

        </div>
      </div>
    </section>
  );
}
