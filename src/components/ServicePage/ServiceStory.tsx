import type { ServicePage } from "@/content/servicePages";
import Figure from "@/components/About/Figure";
import styles from "./ServiceStory.module.css";

const DRAFTS = ["Draft one", "Draft two", "Draft three", "Draft four"];

/**
 * The story behind the service — the problem it solves. The remainder of the
 * live hero copy opens the section; the live "problem" heading and text
 * follow. Beside it, a column of abandoned drafts is struck through one by
 * one as you read (scrubbed), ending on the version that finally holds.
 */
export default function ServiceStory({ page }: { page: ServicePage }) {
  return (
    <section className={styles.story} aria-labelledby="svc-problem">
      <div className={`container ${styles.grid}`}>
        <div className={styles.drafts} aria-hidden="true" data-sp-drafts>
          {DRAFTS.map((d, i) => (
            <span key={d} className={styles.draft} data-sp-draft>
              <span className={styles.draftNo}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.draftText}>
                Chapter One <i>— {d}</i>
              </span>
              <span className={styles.strike} data-sp-strike />
            </span>
          ))}
          <span className={`${styles.draft} ${styles.final}`} data-sp-final>
            <span className={styles.draftNo}>05</span>
            <span className={styles.draftText}>
              Chapter One <i>— the one that holds</i>
            </span>
          </span>
          <Figure image={page.images.story} ratio={4 / 3} sizes="(min-width: 1024px) 34vw, 90vw" className={styles.figure} parallax />
        </div>

        <div className={styles.text}>
          {page.hero.rest && (
            <p className={styles.rest} data-reveal="lines">
              {page.hero.rest}
            </p>
          )}
          <h2 id="svc-problem" className={`serif ${styles.title}`} data-reveal="words">
            {page.problem.title}
          </h2>
          <p className={styles.body} data-reveal="lines" data-reveal-delay="0.1">
            {page.problem.text}
          </p>
        </div>
      </div>
    </section>
  );
}
