import Image from "next/image";
import { aboutHero } from "@/content/aboutContent";
import { renderRich } from "@/components/UI/RichTitle";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./AboutHero.module.css";

const { image, manuscript } = aboutHero;

/**
 * Frontispiece. A story becoming a book, told in one composition:
 * the photograph (where it starts), a typeset manuscript leaf laid over it
 * whose lines write themselves in (the draft), proofreader's notes in the
 * margin (the craft), and a galley slip (the finished voice). Depth comes from
 * layering + scrubbed parallax; the choreography lives in AboutMotion.
 */
export default function AboutHero() {
  return (
    <section className={`surface-ink ${styles.hero}`} aria-labelledby="about-title" data-about-hero>
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.light} data-ah-light />
        <span className={styles.watermark} data-ah-watermark>
          Voice
        </span>
      </div>

      <div className={`container ${styles.grid}`}>
        <p className={styles.running} aria-hidden="true" data-ah-detail>
          <span>Hire A Ghost Writer Now</span>
          <span className={styles.runRule} />
          <span>Frontispiece</span>
        </p>

        <div className={styles.top}>
          <p className="label label--accent" data-ah-eyebrow>
            {aboutHero.eyebrow}
          </p>
          <h1 id="about-title" className={`display ${styles.title}`} data-ah-title>
            {renderRich(aboutHero.title)}
          </h1>
        </div>

        <div className={styles.scene} data-ah-scene>
          <div className={styles.plate} data-ah-plate data-depth="0.4">
            <div className={styles.plateImg} data-ah-img>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                quality={75}
                sizes="(min-width: 1024px) 34vw, (min-width: 768px) 56vw, 78vw"
                style={{ objectFit: "cover", objectPosition: image.position }}
              />
            </div>
            <span className={styles.plateShade} />
          </div>
          <p className={styles.caption} data-ah-detail>
            {aboutHero.caption}
          </p>

          {/* Typeset leaf — illustrative manuscript, decorative */}
          <div className={styles.leaf} aria-hidden="true" data-ah-leaf data-depth="1">
            <span className={styles.leafInner}>
            <span className={styles.leafHead}>
              <span>{manuscript.chapter}</span>
              <span className={styles.leafFolio}>1</span>
            </span>
            <span className={styles.leafRule} />
            <span className={styles.leafBody}>
              {manuscript.lines.map((l, i) => (
                <span key={i} className={styles.leafLine} data-ah-line>
                  {i === 0 ? (
                    <>
                      <span className={styles.dropCap}>{l[0]}</span>
                      {l.slice(1)}
                    </>
                  ) : (
                    l
                  )}
                </span>
              ))}
            </span>
            </span>
            {manuscript.notes.map((n, i) => (
              <span key={n.text} className={`${styles.note} ${styles[`note${i + 1}`]}`} data-ah-note>
                <i>{n.mark}</i> {n.text}
              </span>
            ))}
            <span className={styles.mark} data-ah-note />
          </div>

          <div className={styles.slip} aria-hidden="true" data-ah-slip data-depth="1.6">
            <span className="label">Draft No. 1</span>
            <span className={styles.slipText}>In your voice.</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.intro} data-ah-intro>
            {aboutHero.intro}
          </p>
          <div className={styles.ctas} data-ah-cta>
            <QuoteButton size="lg" />
            <a href={aboutHero.secondary.href} className={styles.textLink}>
              <span>{aboutHero.secondary.label}</span>
              <span className={styles.textLine} aria-hidden="true" />
            </a>
          </div>
        </div>

        <a href="#who-we-are" className={styles.cue} data-ah-detail>
          <span className={styles.cueLine} aria-hidden="true" />
          <span className="label">{aboutHero.scrollCue}</span>
        </a>
      </div>
    </section>
  );
}
