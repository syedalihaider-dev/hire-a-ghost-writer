"use client";

import Image from "next/image";
import Link from "@/components/UI/AppLink";
import { useCallback, useRef, useState } from "react";
import { siteConfig } from "@/content/siteConfig";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { onLoaderDone } from "@/lib/loader";
import QuoteButton from "@/components/UI/QuoteButton";
import Menu from "../Menu/Menu";
import styles from "./Header.module.css";

const { brand } = siteConfig;

export default function Header() {
  const root = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const header = root.current!;
      // Full logo at the top of the page, the circular mark once scrolling.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => header.toggleAttribute("data-scrolled", self.scroll() > 80),
      });

      if (!prefersReducedMotion()) {
        gsap.set(`.${styles.item}`, { autoAlpha: 0, y: -16 });
        onLoaderDone(() =>
          gsap.to(`.${styles.item}`, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE.reveal, stagger: 0.05, delay: 0.1 }),
        );
      }
    },
    { scope: root },
  );

  const close = useCallback(() => {
    setOpen(false);
    menuBtn.current?.focus();
  }, []);

  return (
    <header ref={root} id="site-header" className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={`${styles.item} ${styles.brand}`} aria-label={`${brand.name} — home`}>
          <Image src={brand.logo.reversed.src} alt="" width={190} height={50} className={styles.logoFull} priority sizes="190px" />
          <Image src="/images/brand/icon-192.png" alt="" width={44} height={44} className={styles.logoMark} sizes="44px" />
        </Link>

        <div className={styles.actions}>
          <span className={`${styles.item} ${styles.quote}`}>
            <QuoteButton size="sm" />
          </span>
          <span className={styles.rule} aria-hidden="true" />
          <span className={styles.item}>
            <button
              ref={menuBtn}
              type="button"
              className={styles.menuBtn}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
              data-magnetic
            >
              <span className={styles.menuLabel}>{open ? "Close" : "Menu"}</span>
              <span className={styles.burger} data-open={open || undefined} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          </span>
        </div>
      </div>

      <Menu open={open} onClose={close} />
    </header>
  );
}
