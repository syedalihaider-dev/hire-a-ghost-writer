import type { ServicePage } from "@/content/servicePages";
import styles from "./ServiceProcess.module.css";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * The writing process — four steps standing like spines on a shelf. On
 * desktop the section pins and scrolling pulls one spine open at a time
 * (the others narrow to their titles, set vertically); on touch the steps
 * stack fully open. Every step's copy is in the HTML.
 */
export default function ServiceProcess({ page }: { page: ServicePage }) {
  const { process } = page;
  return (
    <section id="process" className={styles.process} aria-labelledby="svc-process" data-sp-process>
      <div className={`container ${styles.wrap}`}>
        <header className={styles.head}>
          <p className={styles.kicker}>How It Works</p>
          <h2 id="svc-process" className={`display ${styles.title}`} data-reveal="chars">
            {process.title}
          </h2>
        </header>

        <ol role="list" className={styles.spines}>
          {process.steps.map((s, i) => (
            <li key={s.title} className={styles.spine} data-sp-step data-open={i === 0 || undefined}>
              <span className={styles.edge} aria-hidden="true">
                <span className={styles.edgeNo}>{pad(i)}</span>
                <span className={styles.edgeTitle}>{s.title}</span>
              </span>
              <div className={styles.body}>
                <span className={styles.bigNo} aria-hidden="true">
                  {pad(i)}
                </span>
                <h3 className={`serif ${styles.stepTitle}`}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
