import { chapters, formatting, portfolio, TOTAL_CHAPTERS } from "@/content/homeContent";
import SectionHead from "@/components/UI/SectionHead";
import CoverImage from "@/components/UI/CoverImage/CoverImage";
import Archive from "./Archive";
import styles from "./Showcase.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 05 — the finished product. The portfolio is presented as a private
 * publishing archive: the works stand as physical volumes on a shelf
 * (see Archive), each one pulled out, turned and opened like a real book.
 * Every portfolio title and author is in the server-rendered HTML; motion
 * only enhances it. Then the formatting standards, set over typeset pages.
 */
export default function Showcase() {
  return (
    <section className={`surface-dark ${styles.showcase}`} aria-labelledby="showcase-title" data-showcase>
      <div className={styles.driftWrap} aria-hidden="true">
        <p className={`serif ${styles.drift}`} data-drift="-30" data-text="Portfolio — Sample Work — Portfolio — Sample Work" />
      </div>

      <div className={`container ${styles.head}`}>
        <div className={styles.meta} data-reveal="fade">
          <span className="label label--accent">{chapters.showcase.label}</span>
          <span className="label">
            05 / {pad(TOTAL_CHAPTERS)}
          </span>
        </div>
        <h2 id="showcase-title" className={`serif ${styles.lead}`} data-reveal="lines">
          {portfolio.lead}
        </h2>
        <p className={styles.text} data-reveal="lines" data-reveal-delay="0.15">
          {portfolio.text}
        </p>
      </div>

      <Archive />

      <div className={`pad-md ${styles.formatting}`}>
        <CoverImage src="/images/editorial/typeset-book-stack.jpg" tone="navy" shade={0.84} position="50% 60%" />
        <div className="container">
          <SectionHead id="formatting-title" label={chapters.formatting.label} title={chapters.formatting.title} lead={formatting.subtitle} />
          <ol role="list" className={styles.standards} data-reveal-group="0.1">
            {formatting.items.map((item, i) => (
              <li key={item.key} className={styles.standard} data-reveal-item>
                <span className={`display ${styles.outlineNum}`} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h3 className={styles.stdTitle}>{item.title}</h3>
                <p className={styles.stdText}>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
