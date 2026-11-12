"use client";

import { useId, useRef, useState } from "react";
import { servicesFaq } from "@/content/servicesContent";
import { renderRich } from "@/components/UI/RichTitle";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import styles from "./ServicesFaq.module.css";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * Curiosity & Answers. Two shelves of questions (ghostwriting; formatting &
 * publishing) behind accessible tabs, each an accordion whose answer opens
 * with a measured height + masked text rise. Answers stay in the DOM.
 */
export default function ServicesFaq() {
  const base = useId();
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<string | null>(`0-0`);
  const list = useRef<HTMLDivElement>(null);

  const toggle = (key: string) => {
    const next = open === key ? null : key;
    const el = list.current;
    const reduced = prefersReducedMotion();
    if (el && !reduced) {
      const closing = open && el.querySelector<HTMLElement>(`[data-panel="${open}"]`);
      if (closing) gsap.to(closing, { height: 0, duration: 0.55, ease: "power3.inOut" });
      if (next) {
        const panel = el.querySelector<HTMLElement>(`[data-panel="${next}"]`);
        if (panel) {
          gsap.fromTo(panel, { height: 0 }, { height: "auto", duration: 0.7, ease: "power3.inOut" });
          gsap.fromTo(panel.firstElementChild, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: EASE.reveal, delay: 0.15 });
        }
      }
    }
    setOpen(next);
  };

  const selectTab = (i: number) => {
    setTab(i);
    setOpen(`${i}-0`);
    const el = list.current;
    // hand resting heights back to CSS
    if (el) gsap.set(el.querySelectorAll("[data-panel]"), { clearProps: "height" });
    if (el && !prefersReducedMotion())
      requestAnimationFrame(() => gsap.fromTo(el.querySelectorAll("[data-faq-item]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: EASE.reveal, stagger: 0.05 }));
  };

  return (
    <section className={`surface-light ${styles.faq}`} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.side}>
          <p className={styles.mark}>
            <span className={styles.no}>
              07
            </span>
            <span className={styles.label}>{servicesFaq.label}</span>
          </p>
          <h2 id="faq-title" className={`display ${styles.title}`}>
            {renderRich(servicesFaq.title)}
          </h2>

          <div className={styles.tabs} role="tablist" aria-label="Question topics">
            {servicesFaq.groups.map((g, i) => (
              <button
                key={g.key}
                id={`${base}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={tab === i}
                aria-controls={`${base}-panel-${i}`}
                tabIndex={tab === i ? 0 : -1}
                className={styles.tab}
                onClick={() => selectTab(i)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  const n = (i + (e.key === "ArrowRight" ? 1 : -1) + servicesFaq.groups.length) % servicesFaq.groups.length;
                  selectTab(n);
                  document.getElementById(`${base}-tab-${n}`)?.focus();
                }}
              >
                <span className={styles.tabCount}>{pad(g.items.length - 1)}</span>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={list} className={styles.lists}>
          {servicesFaq.groups.map((g, gi) => (
            <div key={g.key} id={`${base}-panel-${gi}`} role="tabpanel" aria-labelledby={`${base}-tab-${gi}`} hidden={tab !== gi} className={styles.list}>
              {g.items.map((item, i) => {
                const key = `${gi}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={item.q} className={styles.item} data-open={isOpen || undefined} data-faq-item>
                    <h3>
                      <button id={`${base}-q-${key}`} type="button" className={styles.q} aria-expanded={isOpen} aria-controls={`${base}-a-${key}`} onClick={() => toggle(key)}>
                        <span className={styles.qNo}>{pad(i)}</span>
                        <span className={styles.qText}>{item.q}</span>
                        <span className={styles.qIcon} aria-hidden="true" />
                      </button>
                    </h3>
                    <div
                      id={`${base}-a-${key}`}
                      role="region"
                      aria-labelledby={`${base}-q-${key}`}
                      className={styles.panel}
                      data-panel={key}
                      inert={!isOpen}
                    >
                      <p className={styles.answer}>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
