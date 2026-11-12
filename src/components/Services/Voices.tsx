import { voices } from "@/content/servicesContent";
import Link from "@/components/UI/AppLink";
import SectionMark from "./SectionMark";
import styles from "./Voices.module.css";

/**
 * "Every story has its own voice" — shown, not told: each category is set
 * in its own typographic voice (italic serif for fiction, small caps for
 * memoir, condensed display for business, footnoted mono for medical &
 * academic, a playful bounce for children's, ruled sober type for legal).
 * Hover one and the others fall quiet.
 */
export default function Voices() {
  return (
    <section className={styles.voices} aria-labelledby="voices-title">
      <div className="container">
        <SectionMark no="03" label={voices.label} title={voices.title} id="voices-title" intro={voices.intro} />

        <ul role="list" className={styles.collage} data-voices>
          {voices.items.map((v) => (
            <li key={v.key} className={`${styles.item} ${styles[v.key]}`} data-voice>
              <Link href={v.href} className={styles.link}>
                <span className={styles.mask}>
                  <span className={styles.word} data-voice-word>
                    {v.key === "children" ? (
                      <>
                        <span className="visually-hidden">{v.word}</span>
                        <span aria-hidden="true">
                          {[...v.word].map((ch, i) => (
                            <span key={i} className={styles.bounce} style={{ animationDelay: `${i * 0.08}s` }}>
                              {ch}
                            </span>
                          ))}
                        </span>
                      </>
                    ) : (
                      v.word
                    )}
                  </span>
                </span>
                <span className={styles.line}>{v.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
