import { journey } from "@/content/servicesContent";
import { renderRich } from "@/components/UI/RichTitle";
import styles from "./Journey.module.css";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * The journey — a top-bound writer's pad. Each stage is a sheet; on desktop
 * the section pins and every scroll step flips the current sheet up over
 * the binding to reveal the next, while the index on the right advances.
 * On touch devices the sheets lay out as a fanned stack of paper.
 * The stage copy lives on the sheets, so it is all in the HTML.
 */
export default function Journey() {
  const n = journey.stages.length;
  return (
    <section className={`surface-ink ${styles.journey}`} aria-labelledby="journey-title" data-journey>
      <div className={`container ${styles.layout}`}>
        <div className={styles.head}>
          <p className={styles.mark}>
            <span className={styles.no}>
              <i>&sect;</i> 05
            </span>
            <span className={styles.label}>{journey.label}</span>
          </p>
          <h2 id="journey-title" className={`display ${styles.title}`} data-reveal="chars">
            {renderRich(journey.title)}
          </h2>
          <ol role="list" className={styles.index} aria-hidden="true">
            {journey.stages.map((s, i) => (
              <li key={s.name} data-jr-step data-active={i === 0 || undefined}>
                <span>{pad(i)}</span>
                {s.name}
              </li>
            ))}
          </ol>
          <p className={styles.counter} aria-hidden="true">
            <span className={styles.counterNow} data-jr-count>
              01
            </span>
            <span className={styles.counterOf}>/ {pad(n - 1)}</span>
          </p>
        </div>

        <div className={styles.pad}>
          <span className={styles.binding} aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          <ol role="list" className={styles.sheets} data-jr-sheets>
            {journey.stages.map((s, i) => (
              <li key={s.name} className={styles.sheet} style={{ zIndex: n - i }} data-jr-sheet>
                <span className={styles.sheetHead}>
                  <span className={styles.stageNo}>Stage {pad(i)}</span>
                  <span className={styles.stageName}>{s.name}</span>
                </span>
                <h3 className={`serif ${styles.sheetTitle}`}>{s.title}</h3>
                <p className={styles.sheetText}>{s.text}</p>
                <span className={styles.ruled} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, k) => (
                    <i key={k} />
                  ))}
                </span>
                <span className={styles.folio} aria-hidden="true">
                  {i + 1} / {n}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
