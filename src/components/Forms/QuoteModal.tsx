"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { quotePanel } from "@/content/homeContent";
import { siteConfig } from "@/content/siteConfig";
import { quoteStore, useQuoteState } from "@/lib/quoteStore";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { lockScroll } from "@/lib/lenis";
import { CloseIcon, PhoneIcon } from "@/components/UI/Icons";
import LeadForm from "./LeadForm";
import styles from "./QuoteModal.module.css";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([tabindex="-1"]), textarea, [tabindex]:not([tabindex="-1"])';

/**
 * "Get a Free Quote" — a centered modal over a dark overlay. Fixed-position,
 * so it never shifts page layout; scroll is locked while open; focus is trapped
 * and returned to the trigger on close.
 */
export default function QuoteModal() {
  const { open, prefill } = useQuoteState();
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(`.${styles.overlay}`, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, 0)
        .fromTo(panel.current, { autoAlpha: 0, y: 40, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: EASE.reveal }, 0.08)
        .from(`.${styles.media}`, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: EASE.heavy }, 0.15)
        .from(`.${styles.stagger} > *`, { autoAlpha: 0, y: 18, duration: 0.6, ease: EASE.reveal, stagger: 0.05 }, 0.25);
    },
    { scope: root },
  );

  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    const others = ["main-content", "site-footer", "site-header"].map((id) => document.getElementById(id));

    if (open) {
      returnFocus.current = document.activeElement as HTMLElement;
      lockScroll(true);
      others.forEach((el) => el && (el.inert = true));
      tl.current?.timeScale(1).play();
      const id = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("input, textarea")?.focus(), 450);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") quoteStore.close();
        if (e.key !== "Tab" || !panel.current) return;
        const nodes = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((n) => n.offsetParent !== null);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.clearTimeout(id);
        window.removeEventListener("keydown", onKey);
      };
    }

    tl.current?.timeScale(1.8).reverse();
    lockScroll(false);
    others.forEach((el) => el && (el.inert = false));
    returnFocus.current?.focus();
  }, [open]);

  return (
    <div ref={root} className={styles.modal} id="quote-drawer" role="dialog" aria-modal="true" aria-labelledby="quote-title" aria-hidden={!open}>
      <div className={styles.overlay} onClick={() => quoteStore.close()} />
      <div ref={panel} className={styles.panel}>
        <button type="button" className={styles.close} onClick={() => quoteStore.close()} aria-label="Close quote form" data-magnetic>
          <CloseIcon size={20} />
        </button>

        <div className={styles.media} aria-hidden="true">
          <Image src="/images/editorial/hero-pen-manuscript.jpg" alt="" fill sizes="(min-width: 900px) 34vw, 100vw" quality={75} />
          <div className={styles.mediaCaption}>
            <p className="label label--accent">{siteConfig.brand.name}</p>
            <p className={`serif ${styles.mediaQuote}`}>{quotePanel.note}</p>
          </div>
        </div>

        <div className={`${styles.body} ${styles.stagger}`}>
          <p className="label label--accent">Start your book</p>
          <h2 id="quote-title" className={`serif ${styles.title}`}>
            {quotePanel.title}
          </h2>
          <p className={styles.subtitle}>{quotePanel.subtitle}</p>
          <LeadForm form="quote" prefill={prefill} tone="dark" />
          <a href={siteConfig.contact.phone.href} className={styles.call}>
            <PhoneIcon size={15} /> {siteConfig.contact.phone.display}
          </a>
        </div>
      </div>
    </div>
  );
}
