import { aboutStory } from "@/content/aboutContent";
import ChapterHead from "./ChapterHead";
import Figure from "./Figure";
import styles from "./AboutStory.module.css";

/**
 * Chapter I — Who we are. An oversized statement that lights up word by word
 * as it is read (scrubbed), then an editorial spread: a tall plate and a
 * smaller offset plate framing a two-column text set with a drop cap and a
 * pull quote — layered, not a two-column image + paragraph block.
 */
export default function AboutStory() {
  const s = aboutStory;
  return (
    <section id="who-we-are" className={`surface-dark ${styles.story}`} aria-labelledby="story-title">
      <div className="container">
        <ChapterHead chapter={s.chapter} label={s.label} id="story-label" />
        <p className={`serif ${styles.statement}`} data-scrub-words>
          {s.statement}
        </p>
      </div>

      <div className={`container ${styles.spread}`}>
        <Figure image={s.image} ratio={4 / 5} sizes="(min-width: 1024px) 38vw, 90vw" caption={s.caption} parallax className={styles.figMain} />
        <Figure image={s.secondImage} ratio={3 / 2} sizes="(min-width: 1024px) 24vw, 60vw" className={styles.figSmall} />

        <div className={styles.text}>
          <h2 id="story-title" className={`serif ${styles.title}`} data-reveal="words">
            {s.title}
          </h2>
          <div className={styles.columns}>
            {s.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? styles.first : undefined} data-reveal="lines" data-reveal-delay={String(i * 0.08)}>
                {p}
              </p>
            ))}
          </div>
          <blockquote className={styles.pull} data-reveal="words">
            <p>{s.pullQuote}</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
