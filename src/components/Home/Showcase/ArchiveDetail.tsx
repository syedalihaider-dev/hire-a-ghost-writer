"use client";

import { useEffect, useLayoutEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { formatting, portfolio } from "@/content/homeContent";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { lockScroll } from "@/lib/lenis";
import { quoteStore } from "@/lib/quoteStore";
import { revealChars } from "@/lib/reveal";
import QuoteButton from "@/components/UI/QuoteButton";
import Volume from "./Volume";
import styles from "./ArchiveDetail.module.css";

const items = portfolio.items;
const N = items.length;
const pad = (n: number) => String(n).padStart(2, "0");
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const OPEN_ANGLE = -164;

const noop = () => () => {};
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

type Props = {
  index: number;
  open: boolean;
  /** The shelf volume ([data-vol]) the book flies from / back to. */
  sourceFor: (i: number) => HTMLElement | null;
  onRequestClose: () => void;
  onIndexChange: (i: number) => void;
  onClosed: (i: number) => void;
};

/**
 * The reading room. Opening: the panel unmasks from the selected book's
 * footprint, the book flies off the shelf (FLIP from its projected box), turns
 * to face the reader and its cover swings open onto a typeset title page; the
 * notes set in line by line. Closing runs the journey home in reverse.
 * Previous / next slide the current book away spine-first and bring the next in.
 */
export default function ArchiveDetail({ index, open, sourceFor, onRequestClose, onIndexChange, onClosed }: Props) {
  const hydrated = useHydrated();
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const wasOpen = useRef(false);
  const busy = useRef(false);
  const incoming = useRef(0); // direction of a pending previous / next swap

  const q = <T extends Element = HTMLElement>(sel: string) => root.current!.querySelector<T>(sel)!;
  const qa = (sel: string) => [...root.current!.querySelectorAll<HTMLElement>(sel)];

  /** Where the closed book must sit (relative to its resting layout box) to overlay the shelf copy. */
  const flipFrom = (i: number) => {
    const src = sourceFor(i)?.querySelector<HTMLElement>("[data-vol-pose]");
    const vol = q("[data-vol]");
    if (!src) return { x: 0, y: window.innerHeight, scale: 0.6, rotationY: 40 };
    const s = src.getBoundingClientRect();
    const t = vol.getBoundingClientRect();
    return {
      x: s.left + s.width / 2 - (t.left + t.width / 2),
      y: s.top + s.height / 2 - (t.top + t.height / 2),
      scale: s.height / t.height,
      rotationY: Number(gsap.getProperty(src, "rotationY")) || 0,
      rect: s,
    };
  };

  const insetOf = (r?: DOMRect) =>
    r ? `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 4px)` : "inset(100% 0% 0% 0% round 0px)";

  /** Notes set in: masked lines rise, the title by character, the rule draws. */
  const textIn = (t: gsap.core.Timeline, at: number) => {
    const title = q("[data-d-title]");
    t.fromTo(qa("[data-d-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE.reveal, stagger: 0.06 }, at)
      .fromTo(q("[data-d-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE.reveal }, at + 0.1)
      .add(() => {
        revealChars(title);
      }, at);
    return t;
  };

  // Hide/show the shelf's copy while the book is "off the shelf".
  const sourceVisible = (i: number, on: boolean) => {
    const s = sourceFor(i);
    if (s) s.style.visibility = on ? "" : "hidden";
  };

  // ---------- Open / close ----------
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || open === wasOpen.current) return;
    wasOpen.current = open;
    tl.current?.kill();
    const reduced = prefersReducedMotion();
    const pose = q("[data-vol-pose]");
    const cover = q("[data-vol-cover]");
    const panel = q("[data-d-panel]");
    const vol = q("[data-vol]");
    const others = [document.getElementById("main-content"), document.getElementById("site-footer"), document.getElementById("site-header")];

    if (open) {
      lockScroll(true);
      others.forEach((n) => n && (n.inert = true));
      window.dispatchEvent(new Event("cursor:reset"));
      gsap.set(el, { visibility: "visible" });
      const half = vol.offsetWidth / 2;

      if (reduced) {
        gsap.set(panel, { clipPath: "none" });
        gsap.set(pose, { x: half, y: 0, scale: 1, rotationY: 0, z: 0 });
        gsap.set(cover, { rotationY: OPEN_ANGLE });
        sourceVisible(index, false);
        closeBtn.current?.focus();
        return;
      }

      const from = flipFrom(index);
      sourceVisible(index, false);
      gsap.set(pose, { x: from.x, y: from.y, scale: from.scale, rotationY: from.rotationY, z: 0 });
      gsap.set(cover, { rotationY: 0 });
      gsap.set(qa("[data-d-line]"), { yPercent: 110 });
      gsap.set(q("[data-d-title]"), { autoAlpha: 0 });
      gsap.set(q("[data-d-rule]"), { scaleX: 0 });

      const t = gsap.timeline({ onComplete: () => void (busy.current = false) });
      busy.current = true;
      t.fromTo(panel, { clipPath: insetOf(from.rect) }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 1.15, ease: EASE.heavy, clearProps: "clipPath" }, 0)
        .to(pose, { x: 0, y: 0, scale: 1, duration: 1.25, ease: "power3.inOut" }, 0.05)
        .to(pose, { rotationY: -14, duration: 0.9, ease: "power2.inOut" }, 0.05)
        .to(pose, { rotationY: 0, duration: 0.8, ease: "power2.out" }, 0.95)
        .to(cover, { rotationY: OPEN_ANGLE, duration: 1.5, ease: EASE.page }, 1.05)
        .to(pose, { x: half, duration: 1.5, ease: EASE.page }, 1.05);
      textIn(t, 0.7);
      tl.current = t;
      window.setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 50);
      return;
    }

    // closing
    const finish = () => {
      sourceVisible(index, true);
      gsap.set(el, { visibility: "hidden" });
      busy.current = false;
      if (!quoteStore.get().open) {
        lockScroll(false);
        others.forEach((n) => n && (n.inert = false));
      }
      onClosed(index);
    };
    if (reduced) return finish();

    busy.current = true;
    const t = gsap.timeline({ onComplete: finish });
    t.to(qa("[data-d-line]"), { yPercent: -110, duration: 0.5, ease: "power3.in", stagger: 0.02 }, 0)
      .to(q("[data-d-title]"), { autoAlpha: 0, duration: 0.35 }, 0)
      .to(q("[data-d-rule]"), { scaleX: 0, duration: 0.5, ease: "power3.in" }, 0)
      .to(cover, { rotationY: 0, duration: 0.85, ease: "power3.inOut" }, 0.05)
      .to(pose, { x: 0, duration: 0.85, ease: "power3.inOut" }, 0.05)
      .add(() => {
        // measure the shelf at the moment of return (it may have moved to a new volume)
        const to = flipFrom(index);
        t.to(pose, { x: to.x, y: to.y, scale: to.scale, rotationY: to.rotationY, duration: 1.05, ease: "power3.inOut" }, ">")
          .to(panel, { clipPath: insetOf(to.rect), duration: 0.95, ease: "power3.inOut" }, "<0.1");
      }, 0.8);
    tl.current = t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ---------- Previous / next: incoming half of the swap ----------
  useLayoutEffect(() => {
    const dir = incoming.current;
    if (!dir || !root.current) return;
    incoming.current = 0;
    const pose = q("[data-vol-pose]");
    const cover = q("[data-vol-cover]");
    const half = q("[data-vol]").offsetWidth / 2;
    sourceVisible(index, false);
    gsap.set(pose, { x: dir * window.innerWidth * 0.45, y: 0, rotationY: -dir * 75, scale: 0.9 });
    gsap.set(cover, { rotationY: 0 });
    gsap.set(qa("[data-d-line]"), { yPercent: 110 });
    gsap.set(q("[data-d-title]"), { autoAlpha: 0 });
    const t = gsap.timeline({ onComplete: () => void (busy.current = false) });
    t.to(pose, { x: 0, rotationY: 0, scale: 1, duration: 1.1, ease: "expo.out" }, 0)
      .to(cover, { rotationY: OPEN_ANGLE, duration: 1.3, ease: EASE.page }, 0.55)
      .to(pose, { x: half, duration: 1.3, ease: EASE.page }, 0.55);
    textIn(t, 0.3);
    tl.current = t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const step = (dir: 1 | -1) => {
    if (busy.current || !root.current) return;
    const next = (index + dir + N) % N;
    if (prefersReducedMotion()) {
      sourceVisible(index, true);
      onIndexChange(next);
      return;
    }
    busy.current = true;
    tl.current?.kill();
    const pose = q("[data-vol-pose]");
    const cover = q("[data-vol-cover]");
    tl.current = gsap
      .timeline({
        onComplete: () => {
          sourceVisible(index, true);
          incoming.current = dir;
          onIndexChange(next);
        },
      })
      .to(qa("[data-d-line]"), { yPercent: -110, duration: 0.45, ease: "power3.in", stagger: 0.02 }, 0)
      .to(q("[data-d-title]"), { autoAlpha: 0, duration: 0.3 }, 0)
      .to(cover, { rotationY: 0, duration: 0.6, ease: "power3.inOut" }, 0)
      .to(pose, { x: 0, duration: 0.6, ease: "power3.inOut" }, 0)
      .to(pose, { x: -dir * window.innerWidth * 0.45, rotationY: dir * 75, scale: 0.9, duration: 0.7, ease: "power3.in" }, 0.5);
  };

  // Keyboard: Escape closes, arrows page through, Tab stays inside.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onRequestClose();
      if (e.key === "ArrowRight") return step(1);
      if (e.key === "ArrowLeft") return step(-1);
      if (e.key !== "Tab" || !root.current) return;
      const nodes = [...root.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const i = nodes.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        nodes[nodes.length - 1]?.focus();
      } else if (!e.shiftKey && i === nodes.length - 1) {
        e.preventDefault();
        nodes[0]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    // Asking for a quote hands over to the quote drawer.
    const unsub = quoteStore.subscribe(() => quoteStore.get().open && onRequestClose());
    return () => {
      window.removeEventListener("keydown", onKey);
      unsub();
    };
  });

  if (!hydrated) return null;

  const item = items[index];
  const style = { "--tone": item.tone, "--light": item.light } as CSSProperties;

  return createPortal(
    <div
      ref={root}
      id="archive-volume"
      className={styles.detail}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-volume-title"
      inert={!open}
      data-lenis-prevent
    >
      <div className={styles.panel} data-d-panel aria-hidden="true">
        <span className={styles.glow} />
        <span className={`display ${styles.ghostNo}`}>{pad(index + 1)}</span>
      </div>

      <div className={styles.inner}>
        <div className={styles.bookStage}>
          <Volume item={item} index={index} titlePage alt={`${item.title} — cover`} sizes="(min-width: 1024px) 22vw, 46vw" className={styles.book} />
        </div>

        <div className={styles.info}>
          <p className={styles.meta}>
            <span className={styles.mask}>
              <span data-d-line className={styles.no}>
                No. {pad(index + 1)} <i>/ {pad(N)}</i>
              </span>
            </span>
            <span className={styles.mask}>
              <span data-d-line className="label label--accent">
                Formatting sample
              </span>
            </span>
          </p>

          <h2 id="archive-volume-title" className={`serif ${styles.title}`} data-d-title>
            {item.title}
          </h2>
          <p className={styles.author}>
            <span className={styles.mask}>
              <span data-d-line>{item.author}</span>
            </span>
          </p>

          <span className={styles.rule} data-d-rule aria-hidden="true" />

          <p className={styles.lead}>
            <span className={styles.mask}>
              <span data-d-line>{portfolio.lead}</span>
            </span>
          </p>

          <div className={styles.standards}>
            <p className={styles.mask}>
              <span data-d-line className="label">
                {formatting.subtitle}
              </span>
            </p>
            <ol role="list">
              {formatting.items.map((f, i) => (
                <li key={f.key} className={styles.mask}>
                  <span data-d-line className={styles.std}>
                    <span className={styles.stdNo}>{pad(i + 1)}</span>
                    <span>{f.title}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.actions}>
            <span className={styles.mask}>
              <span data-d-line className={styles.actionsInner}>
                <QuoteButton />
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.chrome}>
        <button type="button" className={styles.stepBtn} onClick={() => step(-1)} aria-label="Previous volume">
          <span className={styles.arrow} data-dir="prev" aria-hidden="true" />
          <span className={styles.stepText}>Previous</span>
        </button>
        <span className={styles.chromeRule} aria-hidden="true" />
        <button type="button" className={styles.stepBtn} onClick={() => step(1)} aria-label="Next volume">
          <span className={styles.stepText}>Next</span>
          <span className={styles.arrow} data-dir="next" aria-hidden="true" />
        </button>
      </div>

      <button ref={closeBtn} type="button" className={styles.close} onClick={onRequestClose} data-magnetic>
        <span>Close</span>
        <span className={styles.cross} aria-hidden="true" />
      </button>
    </div>,
    document.body,
  );
}
