import Image from "next/image";
import type { CSSProperties } from "react";
import type { PortfolioItem } from "@/content/homeContent";
import styles from "./Volume.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  item: PortfolioItem;
  index: number;
  /** next/image `sizes` for the cover at the width this book renders. */
  sizes: string;
  /** Alt text for the cover; omit when a parent control already names the book. */
  alt?: string;
  /** Typeset title page under the cover (revealed when the cover opens). */
  titlePage?: boolean;
  /** Relative size on the shelf (1 = base width). */
  scale?: number;
  priority?: boolean;
  className?: string;
};

/**
 * A physical hardcover built from CSS 3D faces: cover (hinged so it can open),
 * spine, fore-edge, head and back. Proportions come from the cover image's
 * intrinsic size, so any artwork drops in without cropping.
 *
 * Animation layers (GSAP targets, outermost first):
 *   [data-vol]        entrance / layout offsets
 *   [data-vol-pose]   shelf state — pulled out, turned, lifted
 *   [data-vol-tilt]   pointer tilt
 *   [data-vol-cover]  the cover's hinge
 *   [data-vol-shadow] contact shadow on the shelf
 */
export default function Volume({ item, index, sizes, alt = "", titlePage = false, scale = 1, priority = false, className }: Props) {
  const style = {
    "--ratio": item.cover.height / item.cover.width,
    "--k": scale,
    "--tone": item.tone,
    "--light": item.light,
  } as CSSProperties;

  return (
    <span className={[styles.volume, className].filter(Boolean).join(" ")} style={style} data-vol>
      <span className={styles.shadow} data-vol-shadow aria-hidden="true" />
      <span className={styles.pose} data-vol-pose>
        <span className={styles.tilt} data-vol-tilt>
          <span className={`${styles.face} ${styles.back}`} aria-hidden="true" />
          <span className={`${styles.face} ${styles.head}`} aria-hidden="true" />
          <span className={`${styles.face} ${styles.edge}`} aria-hidden="true" />
          <span className={`${styles.face} ${styles.spine}`}>
            <span className={styles.band} aria-hidden="true" />
            <span className={styles.spineTitle}>{item.title}</span>
            <span className={styles.spineNo} aria-hidden="true">
              {pad(index + 1)}
            </span>
            <span className={styles.band} aria-hidden="true" />
          </span>

          {titlePage && (
            <span className={`${styles.face} ${styles.page}`} aria-hidden="true">
              <span className={styles.pageRule} />
              <span className={styles.pageTitle}>{item.title}</span>
              <span className={styles.pageAuthor}>{item.author}</span>
              <span className={styles.pageRule} />
              <span className={styles.pageFoot}>No. {pad(index + 1)}</span>
            </span>
          )}

          <span className={styles.hinge}>
            <span className={styles.cover} data-vol-cover>
              <span className={`${styles.face} ${styles.coverFront}`}>
                <Image src={item.cover.src} alt={alt} fill sizes={sizes} quality={85} priority={priority} className={styles.coverImg} />
                <span className={styles.sheen} aria-hidden="true" />
              </span>
              <span className={`${styles.face} ${styles.coverInside}`} aria-hidden="true" />
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}
