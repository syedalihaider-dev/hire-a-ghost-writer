import { chapters, intro } from "@/content/homeContent";
import { stats } from "@/content/siteConfig";
import SectionHead from "@/components/UI/SectionHead";
import styles from "./About.module.css";

/** 02 — who we are: statement, three pillars, then the stats band. */
export default function About() {
  return (
    <section className={`surface-light ${styles.about}`} aria-labelledby="about-title">
      <div className={`container pad-md ${styles.inner}`}>
        <SectionHead chapter={2} id="about-title" label={chapters.about.label} title={chapters.about.title} align="stack" />

        <ol role="list" className={styles.pillars} data-reveal-group="0.12">
          {intro.pillars.map((p, i) => (
            <li key={p.title} className={styles.pillar} data-reveal-item>
              <span className="label label--accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.pTitle}>{p.title}</h3>
              <p className={styles.pText}>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={`surface-dark ${styles.stats}`}>
        <dl className={`container ${styles.statsGrid}`}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dt className="label">{s.label}</dt>
              <dd className={styles.value}>
                {s.value !== null ? (
                  <span className="display" data-count={s.value}>
                    {s.value}
                    {s.suffix}
                  </span>
                ) : (
                  <span className={styles.placeholder}>{s.placeholder}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
