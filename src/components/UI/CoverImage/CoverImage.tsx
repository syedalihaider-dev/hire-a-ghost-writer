import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./CoverImage.module.css";

type Props = {
  src: string;
  /** Background imagery is atmosphere, not content — empty alt by default. */
  alt?: string;
  /** Overlay strength 0–1 (default 0.78) — keeps text over the image at AA contrast. */
  shade?: number;
  /** Where the overlay is heaviest. */
  tone?: "ink" | "navy" | "wine";
  /** Object position, e.g. "50% 30%". */
  position?: string;
  sizes?: string;
  className?: string;
};

/**
 * Full-bleed cinematic background for a section: a duotone-darkened photograph
 * that drifts with scroll (data-parallax-bg → ScrollEffects), under a vignette
 * and film grain. Lazy-loaded, sized to the viewport, and decorative only, so
 * content above it stays readable and crawlable.
 * The parent section needs `position: relative; overflow: hidden; isolation: isolate`.
 */
export default function CoverImage({ src, alt = "", shade = 0.78, tone = "ink", position = "50% 50%", sizes = "100vw", className }: Props) {
  return (
    <div className={[styles.cover, styles[tone], className].filter(Boolean).join(" ")} style={{ "--shade": shade } as CSSProperties} aria-hidden={alt ? undefined : true}>
      <div className={styles.layer} data-parallax-bg>
        <Image src={src} alt={alt} fill sizes={sizes} quality={60} className={styles.img} style={{ objectPosition: position }} />
      </div>
      <span className={styles.veil} />
    </div>
  );
}
