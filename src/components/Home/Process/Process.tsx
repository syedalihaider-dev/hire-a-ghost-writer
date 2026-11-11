import { chapters, process } from "@/content/homeContent";
import SectionHead from "@/components/UI/SectionHead";
import styles from "./Process.module.css";

/** 06 — the 4-step method as tall columns; outlined numerals fill with gold as you scroll. */
export default function Process() {
  return (
    <section className={`surface-dark pad-md ${styles.process}`} aria-labelledby="process-title">
      <div className={`container ${styles.inner}`}>
        <SectionHead chapter={6} id="process-title" label={chapters.process.label} title={chapters.process.title} />

        <ol role="list" className={styles.columns} data-reveal-group="0.14">
          {process.steps.map((step, i) => (
            <li key={step.title} className={styles.col} data-reveal-item>
              <div className={styles.top}>
                <span className="label label--accent">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className={`display ${styles.title}`}>{step.title}</h3>
                <p className={styles.text}>{step.text}</p>
              </div>
              <span className={`display ${styles.num}`} data-fill aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
