import type { CSSProperties } from "react";
import { BookMark } from "@/components/UI/Icons";
import styles from "./Book3D.module.css";

type Props = {
  className?: string;
  /** Rendered cover width — any CSS length. Height and thickness derive from it. */
  width?: string;
  /** Initial cover angle in degrees (0 = closed, negative = open). Motion takes over from here. */
  open?: number;
  /** Line shown on the first page, revealed when the cover opens. */
  pageTitle?: string;
};

/**
 * The house hardcover, built from real 3D faces (cover on a hinge, spine,
 * page block, endpaper, first page) with CSS transforms only — no WebGL,
 * no image download, GPU-composited. Decorative: hidden from assistive tech.
 *
 * Motion hooks (GSAP):
 *   [data-book-body]   rotate / tilt the whole volume
 *   [data-book-cover]  swing the cover on its hinge (rotationY)
 *   [data-book-sheen]  light sweep across the cover (xPercent)
 *   [data-book-shadow] contact shadow beneath
 */
export default function Book3D({ className, width = "240px", open = 0, pageTitle = "Chapter One" }: Props) {
  return (
    <div className={[styles.stage, className].filter(Boolean).join(" ")} style={{ "--bw": width } as CSSProperties} aria-hidden="true" data-book>
      <span className={styles.shadow} data-book-shadow />
      <div className={styles.body} data-book-body>
        <div className={`${styles.face} ${styles.back}`} />
        <div className={`${styles.face} ${styles.spine}`}>
          <span className={styles.spineBand} />
          <span className={styles.spineTitle}>Hire A Ghost Writer Now</span>
          <span className={styles.spineBand} />
        </div>
        <div className={`${styles.face} ${styles.fore}`} />
        <div className={`${styles.face} ${styles.top}`} />
        <div className={`${styles.face} ${styles.bottom}`} />

        <div className={`${styles.face} ${styles.page}`}>
          <span className={styles.pageNo}>I</span>
          <span className={styles.pageTitle}>{pageTitle}</span>
          <span className={styles.rule} />
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className={styles.textLine} style={{ width: `${[92, 100, 96, 100, 88, 100, 94, 100, 62][i]}%` }} />
          ))}
        </div>

        <div className={styles.hinge}>
          <div className={styles.cover} data-book-cover style={open ? { transform: `rotateY(${open}deg)` } : undefined}>
            <div className={`${styles.face} ${styles.front}`}>
              <span className={styles.frame} />
              <BookMark className={styles.mark} size={64} />
              <span className={styles.title}>
                Hire a
                <br />
                Ghost Writer
                <br />
                Now
              </span>
              <span className={styles.titleRule} />
              <span className={styles.url}>hireaghostwriternow.com</span>
              <span className={styles.sheenWrap}>
                <span className={styles.sheen} data-book-sheen />
              </span>
            </div>
            <div className={`${styles.face} ${styles.endpaper}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
