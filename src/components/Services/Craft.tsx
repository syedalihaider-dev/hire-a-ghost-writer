import { craft } from "@/content/servicesContent";
import SectionMark from "./SectionMark";
import Figure from "@/components/About/Figure";
import styles from "./Craft.module.css";

const BARS = [14, 30, 52, 38, 70, 44, 88, 60, 34, 76, 92, 58, 40, 66, 82, 48, 28, 62, 86, 54, 36, 72, 46, 24, 58, 80, 42, 30, 64, 50, 22, 40];

/** Small, illustrative visual for each instrument — decorative only. */
function Instrument({ kind }: { kind: string }) {
  if (kind === "interviews")
    return (
      <span className={styles.wave} aria-hidden="true">
        <span className={styles.rec}>
          <i /> REC 00:12:04
        </span>
        <span className={styles.bars}>
          {BARS.map((h, i) => (
            <i key={i} style={{ height: `${h}%`, animationDelay: `${(i % 8) * -0.18}s` }} />
          ))}
        </span>
      </span>
    );
  if (kind === "narrative")
    return (
      <span className={styles.narrative} aria-hidden="true">
        <span className={styles.fragments}>
          <i>the bakery</i>
          <i>1962</i>
          <i>first winter</i>
          <i>his hands</i>
        </span>
        <span className={styles.arrow} />
        <span className={styles.sentence}>That first winter, the bakery was all he had.</span>
      </span>
    );
  return (
    <span className={styles.voice} aria-hidden="true">
      <svg viewBox="0 0 240 70" className={styles.signature}>
        <path d="M6 52c18-30 30-44 36-38s-18 40-6 40 26-46 34-40-8 34 2 34 20-28 30-26-2 22 10 22 18-18 28-18 8 14 18 14 22-10 34-12 20 0 30-2" data-sv-sign />
      </svg>
      <span className={styles.voiceLabel}>In your voice</span>
    </span>
  );
}

/**
 * The craft — what turns memory into a manuscript. A statement from the live
 * page, three "instruments" set as wide typographic rows (each with its own
 * small visual), then the three refinements annotated around a typeset page
 * like an editor's margin notes.
 */
export default function Craft() {
  return (
    <section className={`surface-dark ${styles.craft}`} aria-labelledby="craft-title">
      <div className="container">
        <SectionMark no="02" label={craft.label} title={craft.title} id="craft-title" />

        <div className={styles.lede}>
          <p className={`serif ${styles.statement}`} data-reveal="words">
            &ldquo;{craft.statement}&rdquo;
          </p>
          <p className={styles.text} data-reveal="lines" data-reveal-delay="0.15">
            {craft.text}
          </p>
        </div>

        <ol role="list" className={styles.instruments}>
          {craft.instruments.map((it, i) => (
            <li key={it.key} className={styles.instrument} data-instrument>
              <span className={styles.iNo}>0{i + 1}</span>
              <h3 className={`display ${styles.iTitle}`}>{it.title}</h3>
              <p className={styles.iText}>{it.text}</p>
              <span className={styles.iVisual}>
                <Instrument kind={it.key} />
              </span>
            </li>
          ))}
        </ol>

        <div className={styles.margins} data-margins>
          <p className={styles.marginsLabel}>{craft.refinementsLabel}</p>
          <Figure image={craft.page} ratio={3 / 4} sizes="(min-width: 1024px) 28vw, 80vw" className={styles.page} parallax />
          {craft.refinements.map((r, i) => (
            <div key={r.title} className={`${styles.annot} ${styles[`a${i + 1}`]}`} data-annot>
              <span className={styles.leader} aria-hidden="true" data-annot-line />
              <h3 className={`serif ${styles.aTitle}`}>{r.title}</h3>
              <p className={styles.aText}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
