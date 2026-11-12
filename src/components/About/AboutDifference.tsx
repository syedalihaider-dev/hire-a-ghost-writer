import { aboutDifference } from "@/content/aboutContent";
import { renderRich } from "@/components/UI/RichTitle";
import styles from "./AboutDifference.module.css";

const roman = ["i", "ii", "iii", "iv"];

/**
 * Chapter V — what makes us different, framed as the ghostwriting contract
 * itself: a ledger of what stays yours and what we bring, divided by a gold
 * rule that draws as the chapter enters. Every line is a commitment published
 * on the live site.
 */
export default function AboutDifference() {
  const d = aboutDifference;
  const column = (label: string, items: { title: string; text: string }[], side: "yours" | "ours") => (
    <div className={`${styles.column} ${styles[side]}`}>
      <h3 className={styles.colLabel}>
        <span className="label label--accent">{label}</span>
      </h3>
      <ol role="list" className={styles.list} data-reveal-group="0.1">
        {items.map((it, i) => (
          <li key={it.title} className={styles.entry} data-reveal-item>
            <span className={styles.num} aria-hidden="true">
              {roman[i]}.
            </span>
            <span className={styles.entryBody}>
              <span className={`serif ${styles.entryTitle}`}>{it.title}</span>
              <span className={styles.entryText}>{it.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <section className={`${styles.difference}`} aria-labelledby="difference-title" data-difference>
      <div className="container">
        <p className={styles.mark} data-reveal="fade">
          <span className={styles.chapter}>{d.chapter}</span>
          <span className={styles.rule} aria-hidden="true" />
          <span className="label label--accent">{d.label}</span>
        </p>

        <h2 id="difference-title" className={`serif ${styles.statement}`} data-reveal="chars">
          {renderRich(d.statement)}
        </h2>

        <div className={styles.ledger}>
          {column(d.yoursLabel, d.yours, "yours")}
          <span className={styles.divider} aria-hidden="true" data-diff-rule>
            <span className={styles.seal}>&amp;</span>
          </span>
          {column(d.oursLabel, d.ours, "ours")}
        </div>
      </div>
    </section>
  );
}
