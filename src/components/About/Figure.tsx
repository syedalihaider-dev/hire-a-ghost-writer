import Image from "next/image";
import type { CSSProperties } from "react";
import type { ImageSlot } from "@/content/aboutContent";
import styles from "./Figure.module.css";

type Props = {
  image: ImageSlot;
  /** Frame proportion (width / height). Defaults to the image's own ratio. */
  ratio?: number;
  sizes: string;
  caption?: string;
  priority?: boolean;
  /** Clip-path wipe when scrolled into view (ScrollEffects). */
  reveal?: boolean;
  /** Scrubbed drift of the photograph inside its frame (ScrollEffects). */
  parallax?: boolean;
  className?: string;
  /** Extra data attribute hooks for bespoke timelines. */
  hook?: string;
};

/**
 * Art-directed image slot. The frame owns the proportion and the reveal mask,
 * the photograph only fills it — so masks and motion never depend on the
 * asset. Swap `image.src` (+ width/height) in aboutContent.ts to replace art.
 */
export default function Figure({ image, ratio, sizes, caption, priority, reveal = true, parallax = false, className, hook }: Props) {
  const r = ratio ?? image.width / image.height;
  const fit = image.fit ?? "cover";
  return (
    <figure className={[styles.figure, className].filter(Boolean).join(" ")} style={{ "--ratio": r } as CSSProperties} {...(hook ? { [`data-${hook}`]: "" } : {})}>
      <div className={styles.frame} data-reveal={reveal ? "image" : undefined} data-figure-frame>
        <div className={`${styles.inner} ${parallax ? styles.drift : ""}`} data-parallax={parallax ? "6" : undefined}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={75}
            className={styles.img}
            style={{ objectPosition: image.position ?? "50% 50%", objectFit: fit }}
          />
        </div>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
