import type { ServicePage } from "@/content/servicePages";
import styles from "./ServiceTestimonials.module.css";

/**
 * Testimonials as the back cover of the book — the page's own live quotes
 * set as blurbs in columns, each attributed exactly as on the live page.
 * Renders nothing for a service without testimonials.
 */
export default function ServiceTestimonials({ page }: { page: ServicePage }) {
  if (!page.testimonials) return null;
  const { title, items } = page.testimonials;
  return (
    <section className={styles.back} aria-labelledby="svc-voices">
      <div className="container">
        <div className={styles.cover}>
          <header className={styles.head}>
            <p className={styles.kicker}>From the back cover</p>
            <h2 id="svc-voices" className={`serif ${styles.title}`} data-reveal="words">
              {title}
            </h2>
          </header>
          <ul role="list" className={styles.blurbs}>
            {items.map((t, i) => (
              <li key={`${t.name}-${i}`} className={styles.blurb} data-sp-blurb>
                <figure>
                  <blockquote className={styles.quote}>
                    <p>{t.quote}</p>
                  </blockquote>
                  <figcaption className={styles.cite}>
                    <span className={styles.name}>{t.name}</span>
                    {t.role && <span className={styles.role}>{t.role}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
