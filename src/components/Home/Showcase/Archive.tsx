"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { portfolio } from "@/content/homeContent";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { getLenis } from "@/lib/lenis";
import Volume from "./Volume";
import ArchiveDetail from "./ArchiveDetail";
import styles from "./Archive.module.css";

const items = portfolio.items;
const N = items.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Relative heights on the shelf — real collections are never uniform. */
const SCALES = [1, 0.92, 0.97, 0.88];
/** Resting lean per volume (deg) — spines out, each a touch different. */
const LEAN = [62, 58, 65, 60];
/** A selected volume: pulled toward the reader, turned to show its cover, lifted. */
const OUT = { rotationY: 12, z: 160, y: -26 };

type Mode = "shelf" | "swipe" | "still";

/**
 * The Archive — the portfolio as a physical bookshelf.
 *
 *  Desktop: the shelf pins and scrolling walks along it; each step pulls the
 *  next volume out of the row, turns its cover to the reader and parts its
 *  neighbours. Hover takes over from scroll (pull any book), the pointer
 *  steers a subtle camera and tilts the selected book.
 *  Touch: the shelf becomes a swipeable row; whichever book is centred turns
 *  to face you, the rest angle their spines toward it. Tap to open.
 *  Opening a volume flies it from the shelf into a full-screen reading room
 *  (ArchiveDetail) and opens its cover.
 */
export default function Archive() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const books = useRef<HTMLUListElement>(null);
  const readout = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState({ index: 0, open: false });

  const activeRef = useRef(0);
  const mode = useRef<Mode>("still");
  const ctx = useRef<gsap.Context | null>(null);
  const pin = useRef<ScrollTrigger | null>(null);
  const hoverLock = useRef(false);
  const detailOpen = useRef(false);
  const mounted = useRef(false);

  const select = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
  }, []);

  const slotEls = () => [...(books.current?.querySelectorAll<HTMLElement>("[data-slot]") ?? [])];

  /** Shelf pose for the selected index (desktop / reduced motion). */
  const arrange = useCallback((a: number, instant = false) => {
    if (mode.current === "swipe" || !books.current) return;
    const run = () => {
      const d = instant ? 0 : mode.current === "still" ? 0.35 : 1;
      slotEls().forEach((slot, i) => {
        const vol = slot.querySelector<HTMLElement>("[data-vol]")!;
        const pose = vol.querySelector("[data-vol-pose]");
        const shadow = vol.querySelector("[data-vol-shadow]");
        const part = vol.offsetWidth * 0.3;
        const x = i < a ? -part : i > a ? part : 0;
        const on = i === a;
        const target = on ? OUT : { rotationY: LEAN[i], z: 0, y: 0 };
        gsap.to(pose, { x, ...target, duration: 1.15 * d, ease: "expo.out", overwrite: "auto" });
        gsap.to(shadow, { x, z: target.z, scaleX: on ? 1.25 : 0.8, opacity: on ? 0.5 : 0.95, duration: 1.15 * d, ease: "expo.out", overwrite: "auto" });
      });
      const slot = slotEls()[a];
      if (slot && books.current && stage.current) {
        const pct = ((slot.offsetLeft + slot.offsetWidth / 2) / books.current.offsetWidth) * 100;
        gsap.to(stage.current, { "--lx": `${pct}%`, duration: 1.4 * d, ease: "power3.out", overwrite: "auto" });
      }
    };
    if (ctx.current) ctx.current.add(run);
    else run();
  }, []);

  // Pose + readout follow the selection.
  useEffect(() => {
    // first pass is posed by the environment build below (instantly)
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    arrange(active);
    if (mode.current === "still" || !readout.current) return;
    const lines = readout.current.querySelectorAll("[data-ro]");
    gsap.fromTo(lines, { yPercent: 108 }, { yPercent: 0, duration: 0.95, ease: "expo.out", stagger: 0.06, overwrite: true });
    const num = stage.current?.querySelector("[data-ro-num]");
    if (num) gsap.fromTo(num, { yPercent: 40, rotationX: -50 }, { yPercent: 0, rotationX: 0, duration: 1.2, ease: "expo.out", overwrite: true });
  }, [active, arrange]);

  // Build the interaction for each environment.
  useEffect(() => {
    const el = root.current;
    const r = rail.current;
    const ul = books.current;
    const st = stage.current;
    if (!el || !r || !ul || !st) return;
    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1024px)",
        touch: "(max-width: 1023.98px)",
        motion: MQ.motion,
      },
      (context) => {
        ctx.current = context;
        const { desktop, motion } = context.conditions as { desktop: boolean; touch: boolean; motion: boolean };
        const slots = slotEls();
        const vols = slots.map((s) => s.querySelector<HTMLElement>("[data-vol]")!);
        const poses = vols.map((v) => v.querySelector<HTMLElement>("[data-vol-pose]")!);
        const shadows = vols.map((v) => v.querySelector<HTMLElement>("[data-vol-shadow]")!);
        const tilts = vols.map((v) => v.querySelector<HTMLElement>("[data-vol-tilt]")!);
        const cleanups: (() => void)[] = [];

        // ---------- Desktop: pinned shelf ----------
        if (desktop) {
          mode.current = motion ? "shelf" : "still";
          arrange(activeRef.current, true);

          if (motion) {
            // Entrance: the alcove opens upward, the shelf is laid, volumes slide in spine-first.
            const decor = ul.querySelectorAll("[data-decor]");
            gsap.set(st, { clipPath: "inset(100% 0% 0% 0%)" });
            gsap.set(vols, { y: 160, rotationY: 28 });
            gsap.set(decor, { yPercent: 40, autoAlpha: 0 });
            ScrollTrigger.create({
              trigger: el,
              start: "top 70%",
              once: true,
              onEnter: () =>
                context.add(() => {
                  gsap
                    .timeline()
                    .to(st, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EASE.heavy, clearProps: "clipPath" }, 0)
                    .from(st.querySelector("[data-plank]"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.6, ease: EASE.reveal }, 0.2)
                    .to(vols, { y: 0, rotationY: 0, duration: 1.7, ease: "expo.out", stagger: 0.1 }, 0.35)
                    .to(decor, { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: EASE.reveal, stagger: 0.1 }, 0.7);
                }),
            });

            // Scroll walks the shelf. The pin's scrub also drifts the row and the numeral.
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: () => `+=${window.innerHeight * 0.7 * (N - 1)}`,
                pin: true,
                scrub: 0.8,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  if (hoverLock.current || detailOpen.current) return;
                  const i = Math.round(self.progress * (N - 1));
                  if (i !== activeRef.current) select(i);
                },
              },
            });
            tl.fromTo(ul, { xPercent: 5 }, { xPercent: -5, ease: "none" }, 0).fromTo(
              st.querySelector("[data-numeral]"),
              { yPercent: 10 },
              { yPercent: -10, ease: "none" },
              0,
            );
            pin.current = tl.scrollTrigger ?? null;

            // Pointer: a slow camera over the whole shelf + tilt on the selected book.
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
              const camY = gsap.quickTo(r, "rotationY", { duration: 1.4, ease: "power3.out" });
              const camX = gsap.quickTo(r, "rotationX", { duration: 1.4, ease: "power3.out" });
              const tiltTo = tilts.map((t) => ({
                ry: gsap.quickTo(t, "rotationY", { duration: 0.9, ease: "power3.out" }),
                rx: gsap.quickTo(t, "rotationX", { duration: 0.9, ease: "power3.out" }),
              }));
              const onMove = (e: PointerEvent) => {
                const box = st.getBoundingClientRect();
                const px = (e.clientX - box.left) / box.width - 0.5;
                const py = (e.clientY - box.top) / box.height - 0.5;
                camY(px * 7);
                camX(-py * 3);
                tiltTo.forEach((t, i) => {
                  const on = i === activeRef.current;
                  t.ry(on ? px * 16 : 0);
                  t.rx(on ? -py * 8 : 0);
                });
              };
              const onLeave = () => {
                camY(0);
                camX(0);
                tiltTo.forEach((t) => (t.ry(0), t.rx(0)));
                if (hoverLock.current) {
                  hoverLock.current = false;
                  const p = pin.current;
                  if (p?.isActive && !detailOpen.current) select(Math.round(p.progress * (N - 1)));
                }
              };
              st.addEventListener("pointermove", onMove);
              st.addEventListener("pointerleave", onLeave);
              cleanups.push(() => {
                st.removeEventListener("pointermove", onMove);
                st.removeEventListener("pointerleave", onLeave);
              });
            }
          }
        }

        // ---------- Touch: swipeable shelf ----------
        else {
          mode.current = "swipe";
          gsap.killTweensOf([...poses, ...shadows]);
          let raf = 0;
          const update = () => {
            raf = 0;
            const centre = ul.scrollLeft + ul.clientWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            slots.forEach((slot, i) => {
              const t = (slot.offsetLeft + slot.offsetWidth / 2 - centre) / slot.offsetWidth;
              const near = 1 - Math.min(Math.abs(t), 1);
              gsap.set(poses[i], { x: 0, rotationY: gsap.utils.clamp(-60, 60, -t * 52), z: near * 90, y: -near * 30 });
              gsap.set(shadows[i], { x: 0, z: near * 90, scaleX: 0.8 + near * 0.35, opacity: 0.95 - near * 0.4 });
              if (Math.abs(t) < bestDist) {
                bestDist = Math.abs(t);
                best = i;
              }
            });
            if (best !== activeRef.current && !detailOpen.current) select(best);
          };
          const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
          };
          // start centred on the current selection
          const s = slots[activeRef.current];
          if (s) ul.scrollLeft = s.offsetLeft + s.offsetWidth / 2 - ul.clientWidth / 2;
          update();
          ul.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          cleanups.push(() => {
            ul.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(raf);
          });

          if (motion) {
            gsap.set(vols, { y: 120 });
            ScrollTrigger.create({
              trigger: ul,
              start: "top 85%",
              once: true,
              onEnter: () => context.add(() => gsap.to(vols, { y: 0, duration: 1.4, ease: "expo.out", stagger: 0.08 })),
            });
          }
        }

        return () => {
          cleanups.forEach((c) => c());
          ctx.current = null;
          pin.current = null;
          mode.current = "still";
        };
      },
    );

    return () => mm.revert();
  }, [arrange, select]);

  /** Bring volume i to the reading position (scroll-synced where scroll drives the shelf). */
  const goTo = (i: number) => {
    const ul = books.current;
    if (mode.current === "swipe" && ul) {
      const s = slotEls()[i];
      ul.scrollTo({ left: s.offsetLeft + s.offsetWidth / 2 - ul.clientWidth / 2, behavior: "smooth" });
      return;
    }
    const p = pin.current;
    if (p) {
      const y = p.start + ((p.end - p.start) * i) / (N - 1);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    }
    select(i);
  };

  const open = (i: number) => {
    detailOpen.current = true;
    select(i);
    setDetail({ index: i, open: true });
  };

  const onVolumeClick = (i: number) => {
    if (mode.current === "swipe" && i !== activeRef.current) return goTo(i);
    open(i);
  };

  const onVolumeKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + N) % N;
    slotEls()[next]?.querySelector<HTMLElement>("button")?.focus();
  };

  const item = items[active];

  return (
    <div ref={root} className={styles.archive} data-archive>
      <div className={`container ${styles.grid}`}>
        <div ref={readout} className={styles.readout}>
          <p className={styles.roHead}>
            <span className="label label--accent">The Archive</span>
            <span className={styles.roCount}>
              {pad(active + 1)} <i>/ {pad(N)}</i>
            </span>
          </p>

          <div className={styles.roBody}>
            <p className={styles.roNo}>
              <span className={styles.mask}>
                <span data-ro>No. {pad(active + 1)}</span>
              </span>
            </p>
            <h3 className={`serif ${styles.roTitle}`}>
              <span className={styles.mask}>
                <span data-ro>{item.title}</span>
              </span>
            </h3>
            <p className={styles.roAuthor}>
              <span className={styles.mask}>
                <span data-ro>{item.author}</span>
              </span>
            </p>
            <p className={`label ${styles.roKind}`}>Formatting sample</p>
            <button type="button" className={styles.openBtn} onClick={() => open(active)} aria-haspopup="dialog">
              <span>Open the volume</span>
              <span className={styles.openLine} aria-hidden="true" />
            </button>
          </div>

          <ol role="list" className={styles.index} aria-label="Volumes in the archive">
            {items.map((it, i) => (
              <li key={it.title}>
                <button type="button" className={styles.indexBtn} data-current={i === active || undefined} aria-current={i === active || undefined} onClick={() => goTo(i)}>
                  <span className={styles.indexNo}>{pad(i + 1)}</span>
                  <span className={styles.indexTitle}>{it.title}</span>
                  <span className={styles.indexBar} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>

          <p className={styles.hint} aria-hidden="true">
            <span className={styles.hintDesk}>Scroll to browse — hover to pull a volume</span>
            <span className={styles.hintTouch}>Swipe the shelf — tap the centred book to open</span>
          </p>
        </div>

        <div ref={stage} className={styles.stage}>
          <span className={styles.lamp} aria-hidden="true" />
          <span className={`display ${styles.numeral}`} aria-hidden="true" data-numeral>
            <span data-ro-num>{pad(active + 1)}</span>
          </span>

          <div ref={rail} className={styles.rail}>
            <ul ref={books} role="list" className={styles.books} aria-label="Portfolio shelf">
              <li className={styles.bookend} aria-hidden="true" data-decor>
                <span />
              </li>
              {items.map((it, i) => (
                <li key={it.title} className={styles.slot} data-slot data-active={i === active || undefined}>
                  <button
                    type="button"
                    className={styles.volBtn}
                    aria-label={`${it.title}, ${it.author} — open the formatting sample`}
                    aria-haspopup="dialog"
                    data-cursor="Open"
                    onPointerEnter={(e) => {
                      if (e.pointerType !== "mouse" || mode.current === "swipe") return;
                      hoverLock.current = true;
                      if (i !== activeRef.current) select(i);
                    }}
                    onFocus={() => mode.current !== "swipe" ? i !== activeRef.current && select(i) : goTo(i)}
                    onClick={() => onVolumeClick(i)}
                    onKeyDown={(e) => onVolumeKey(e, i)}
                  >
                    <Volume item={it} index={i} scale={SCALES[i % SCALES.length]} sizes="(min-width: 1024px) 15vw, 42vw" />
                  </button>
                </li>
              ))}
              <li className={styles.stack} aria-hidden="true" data-decor>
                <span />
                <span />
                <span />
              </li>
            </ul>
            <span className={styles.plank} aria-hidden="true" data-plank>
              <span className={styles.plankTop} />
              <span className={styles.plankFront} />
            </span>
          </div>
        </div>
      </div>

      <ArchiveDetail
        index={detail.index}
        open={detail.open}
        sourceFor={(i) => slotEls()[i]?.querySelector<HTMLElement>("[data-vol]") ?? null}
        onRequestClose={() => setDetail((d) => ({ ...d, open: false }))}
        onIndexChange={(i) => {
          select(i);
          if (mode.current === "swipe" && books.current) {
            const s = slotEls()[i];
            books.current.scrollLeft = s.offsetLeft + s.offsetWidth / 2 - books.current.clientWidth / 2;
          }
          setDetail({ index: i, open: true });
        }}
        onClosed={(i) => {
          detailOpen.current = false;
          hoverLock.current = false;
          slotEls()[i]?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
        }}
      />
    </div>
  );
}
