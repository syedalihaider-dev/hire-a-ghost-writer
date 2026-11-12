import { aboutProcess } from "@/content/aboutContent";
import ChapterHead from "./ChapterHead";
import styles from "./AboutProcess.module.css";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/**
 * Chapter IV — the writing process as a manuscript that evolves while you
 * read. A sticky artifact builds up layer by layer (notes → outline → draft →
 * proof marks → bound book) as each stage passes the reading line; a progress
 * rail threads the stages together. Stage switching lives in AboutMotion.
 * The artifact is decorative; the stages are the content.
 */
export default function AboutProcess() {
  const p = aboutProcess;
  return (
    <section className={`surface-dark ${styles.process}`} aria-labelledby="process-title" data-process>
      <div className="container">
        <ChapterHead chapter={p.chapter} label={p.label} title={p.title} id="process-title" intro={p.intro} />
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.stickyWrap}>
          <div className={styles.artifact} aria-hidden="true" data-pr-artifact>
            {/* 01 — notes */}
            <div className={`${styles.layer} ${styles.notes}`} data-pr-layer>
              <span className={`${styles.card} ${styles.card1}`}>A story about my grandfather&rsquo;s bakery</span>
              <span className={`${styles.card} ${styles.card2}`}>
                <b>Voice memo</b> 12:04
              </span>
              <span className={`${styles.card} ${styles.card3}`}>Chapter idea &mdash; the first winter?</span>
            </div>

            {/* 02 — outline */}
            <div className={`${styles.layer} ${styles.page}`} data-pr-layer>
              <span className={styles.pageKicker}>Outline</span>
              <span className={styles.pageRule} />
              {["Beginnings", "The first winter", "Rebuilding", "What remains"].map((t, i) => (
                <span key={t} className={styles.toc}>
                  <i>{i + 1}</i>
                  <span>{t}</span>
                  <span className={styles.leader} />
                  <span>{(i + 1) * 12}</span>
                </span>
              ))}
            </div>

            {/* 03 — draft */}
            <div className={`${styles.layer} ${styles.page}`} data-pr-layer>
              <span className={styles.pageKicker}>Chapter One</span>
              <span className={styles.pageRule} />
              <span className={styles.draftTitle}>Beginnings</span>
              <span className={styles.lines}>
                {[100, 94, 98, 88, 100, 92, 97, 60, 100, 95, 99, 72].map((w, i) => (
                  <span key={i} style={{ width: `${w}%` }} />
                ))}
              </span>
            </div>

            {/* 04 — refine: proof marks laid over the draft */}
            <div className={`${styles.layer} ${styles.marks}`} data-pr-layer>
              <span className={`${styles.strike} ${styles.s1}`} />
              <span className={`${styles.strike} ${styles.s2}`} />
              <span className={`${styles.margin} ${styles.m1}`}>tighten</span>
              <span className={`${styles.margin} ${styles.m2}`}>new paragraph</span>
              <span className={`${styles.margin} ${styles.m3}`}>your voice</span>
            </div>

            {/* 05 — the bound book */}
            <div className={`${styles.layer} ${styles.bookLayer}`} data-pr-layer>
              <span className={styles.book}>
                <span className={styles.bookSpine} />
                <span className={styles.bookCover}>
                  <span className={styles.bookFrame}>
                    <span className={styles.bookKicker}>A Memoir</span>
                    <span className={styles.bookTitle}>Your Story</span>
                    <span className={styles.bookRule} />
                    <span className={styles.bookAuthor}>by You</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.stagesWrap}>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} data-pr-progress />
          </span>
          <ol role="list" className={styles.stages}>
          {p.stages.map((s, i) => (
            <li key={s.key} className={styles.stage} data-pr-stage data-active={i === 0 || undefined}>
              <span className={styles.marker} aria-hidden="true">
                {pad(i)}
              </span>
              <p className={`display ${styles.stageName}`}>{s.name}</p>
              <h3 className={`serif ${styles.stageTitle}`} data-reveal="words">
                {s.title}
              </h3>
              <p className={styles.stageText} data-reveal="lines">
                {s.text}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
