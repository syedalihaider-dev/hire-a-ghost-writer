import { aboutPhilosophy } from "@/content/aboutContent";
import RichTitle from "@/components/UI/RichTitle";
import Figure from "./Figure";
import styles from "./AboutPhilosophy.module.css";

/**
 * Chapter II — Philosophy. On desktop the chapter pins and reads sideways like
 * turning pages: an opening plate, then four tenets set as typographic spreads
 * (outlined numeral, serif statement, short gloss). A folio rail tracks
 * progress. On touch devices the same spreads stack vertically.
 */
export default function AboutPhilosophy() {
  const p = aboutPhilosophy;
  return (
    <section className={`surface-light ${styles.philosophy}`} aria-labelledby="philosophy-title" data-philosophy>
      <div className={styles.viewport}>
        <ol role="list" className={styles.track} data-ph-track>
          <li className={`${styles.panel} ${styles.opening}`}>
            <p className={styles.mark}>
              <span className={styles.chapter}>{p.chapter}</span>
              <span className="label label--accent">{p.label}</span>
            </p>
            <RichTitle text={p.title} id="philosophy-title" className={styles.title} />
            <Figure image={p.image} ratio={3 / 4} sizes="(min-width: 1024px) 22vw, 70vw" className={styles.figure} />
          </li>
          {p.tenets.map((t) => (
            <li key={t.numeral} className={`${styles.panel} ${styles.tenet}`} data-ph-panel>
              <span className={styles.numeral} aria-hidden="true" data-ph-numeral>
                {t.numeral}
              </span>
              <div className={styles.tenetBody}>
                <h3 className={`serif ${styles.tenetTitle}`} data-ph-title>
                  {t.title}
                </h3>
                <span className={styles.tenetRule} aria-hidden="true" data-ph-rule />
                <p className={styles.tenetText} data-ph-text>
                  {t.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={`container ${styles.rail}`} aria-hidden="true">
        <span className={styles.railTrack}>
          <span className={styles.railFill} data-ph-progress />
        </span>
        <span className={styles.railLabels}>
          {p.tenets.map((t) => (
            <span key={t.numeral}>{t.numeral}</span>
          ))}
        </span>
      </div>
    </section>
  );
}
