"use client";

import { useEffect, useRef } from "react";
import Link from "@/components/UI/AppLink";
import { siteConfig } from "@/content/siteConfig";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { lockScroll } from "@/lib/lenis";
import { quoteStore } from "@/lib/quoteStore";
import { sound, useSoundEnabled } from "@/lib/audio";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./Menu.module.css";

const { navigation, contact } = siteConfig;
const services = navigation.find((n) => "children" in n && n.children)?.children ?? [];
const FOCUSABLE = 'a[href], button:not([disabled])';

/** Full-screen menu: clip-path wipe, staggered giant links, services + contact columns. */
export default function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const wasOpen = useRef(false);
  const soundOn = useSoundEnabled();

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(root.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: EASE.heavy })
        .from(`.${styles.linkInner}`, { yPercent: 110, duration: 1, ease: EASE.reveal, stagger: 0.06 }, 0.35)
        .from(`.${styles.col} > *`, { autoAlpha: 0, y: 20, duration: 0.7, ease: EASE.reveal, stagger: 0.04 }, 0.5);
    },
    { scope: root },
  );

  useEffect(() => quoteStore.subscribe(() => quoteStore.get().open && open && onClose()), [open, onClose]);

  useEffect(() => {
    const t = tl.current;
    if (!t || open === wasOpen.current) return;
    wasOpen.current = open;
    const main = document.getElementById("main-content");
    const footer = document.getElementById("site-footer");

    if (open) {
      lockScroll(true);
      sound.pageFlip(0.8);
      t.timeScale(1).play();
      [main, footer].forEach((el) => el && (el.inert = true));
      const id = window.setTimeout(() => root.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(), 400);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key !== "Tab" || !root.current) return;
        const nodes = [...root.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
        const menuBtn = document.querySelector<HTMLElement>('[aria-controls="site-menu"]');
        const ring = menuBtn ? [...nodes, menuBtn] : nodes;
        const i = ring.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          ring[ring.length - 1]?.focus();
        } else if (!e.shiftKey && i === ring.length - 1) {
          e.preventDefault();
          ring[0]?.focus();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.clearTimeout(id);
        window.removeEventListener("keydown", onKey);
      };
    }

    t.timeScale(1.7).reverse();
    if (!quoteStore.get().open) {
      lockScroll(false);
      [main, footer].forEach((el) => el && (el.inert = false));
    }
  }, [open, onClose]);

  const pad = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <div ref={root} id="site-menu" className={styles.menu} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open}>
      <div className={styles.inner}>
        <nav aria-label="Main" className={styles.nav}>
          <ul role="list">
            {navigation.map((item, i) => (
              <li key={item.href} className={styles.row}>
                <Link href={item.href} className={styles.link} onClick={onClose} onMouseEnter={() => sound.tick()}>
                  <span className={styles.linkInner}>
                    <span className="label">{pad(i)}</span>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <p className="label label--accent">Our Services</p>
          <ul role="list" className={styles.services}>
            {services.map((s, i) => (
              <li key={s.href}>
                <Link href={s.href} onClick={onClose} className="link-line">
                  {s.label} <span className={styles.idx}>[ {pad(i)} ]</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <p className="label label--accent">Contact</p>
          <a href={contact.phone.href} className={styles.phone}>
            {contact.phone.display}
          </a>
          <address className={styles.address}>{contact.address.display}</address>
          <button type="button" className="label" onClick={() => sound.setEnabled(!soundOn)} aria-pressed={soundOn}>
            Sound: {soundOn ? "On" : "Off"}
          </button>
          <QuoteButton size="lg" />
        </div>
      </div>
    </div>
  );
}
