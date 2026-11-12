import { aboutTrust } from "@/content/aboutContent";
import { testimonials } from "@/content/homeContent";
import ChapterHead from "./ChapterHead";
import Figure from "./Figure";
import TrustQuotes from "./TrustQuotes";
import styles from "./AboutTrust.module.css";

/**
 * Chapter VI — credibility without a wall of badges: the authors' own words
 * (the testimonials published on the live homepage) read like a single page
 * of a book, a ledger of names to turn to, and the studio's assurances set
 * as a typographic colophon. A third-party rating only appears when
 * `aboutTrust.rating` is filled in with a verifiable source.
 */
export default function AboutTrust() {
  const t = aboutTrust;
  return (
    <section className={`surface-light ${styles.trust}`} aria-labelledby="trust-title">
      <div className="container">
        <ChapterHead chapter={t.chapter} label={t.label} title={t.title} id="trust-title" intro={testimonials.text} />

        <div className={styles.body}>
          <TrustQuotes items={testimonials.items} />
          <div className={styles.aside}>
            <Figure image={t.image} ratio={4 / 5} sizes="(min-width: 1024px) 26vw, 60vw" parallax />
            {t.rating && (
              <a href={t.rating.href} className={styles.rating} target="_blank" rel="noopener noreferrer">
                <span className={`serif ${styles.score}`}>{t.rating.score}</span>
                <span className={styles.ratingText}>
                  {t.rating.count} reviews on {t.rating.source}
                </span>
              </a>
            )}
          </div>
        </div>
      </div>

      <ul role="list" className={styles.assurances} aria-label="Our assurances">
        {t.assurances.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </section>
  );
}
