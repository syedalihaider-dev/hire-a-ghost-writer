import { Fragment } from "react";
import { marquee } from "@/content/homeContent";
import { BookMark } from "@/components/UI/Icons";
import RibbonMotion from "./RibbonMotion";
import styles from "./Ribbon.module.css";

// Brand vocabulary for the gold band (client-provided wording).
const WORDS = ["Ghostwriting", "Book Writing", "Editorial", "Storytelling", "Publishing"];

/**
 * Transition from the dark hero into the light chapters: two oversized bands
 * cross the seam at opposing angles and travel in opposite directions as you
 * scroll (scrubbed — no constant animation loop).
 */
export default function Ribbon() {
  const band = (items: string[], key: string, mark: boolean) =>
    [0, 1, 2].map((rep) => (
      <Fragment key={`${key}-${rep}`}>
        {items.map((w) => (
          <span key={`${key}-${rep}-${w}`} className={styles.item} aria-hidden={rep > 0 || undefined}>
            {w}
            {mark ? <BookMark className={styles.mark} size={34} /> : <span className={styles.dot}>✦</span>}
          </span>
        ))}
      </Fragment>
    ));

  return (
    <section className={styles.ribbon} aria-label="What we do and our publishing credentials" data-ribbon>
      <div className={`${styles.band} ${styles.back}`}>
        <div className={styles.track} data-ribbon-track="1">
          {band(marquee, "cred", false)}
        </div>
      </div>
      <div className={`${styles.band} ${styles.front}`}>
        <div className={styles.track} data-ribbon-track="-1">
          {band(WORDS, "word", true)}
        </div>
      </div>
      <RibbonMotion />
    </section>
  );
}
