import Image from "next/image";
import type { ServicePage } from "@/content/servicePages";
import Link from "@/components/UI/AppLink";
import styles from "./ServiceShowcase.module.css";

/**
 * Showcase — uses the live heading. Where real portfolio samples exist (set
 * `portfolio: true` in the service config) they stand on a lit shelf, labelled
 * exactly as the studio labels them. Every page also carries the related
 * services, as the live pages do — internal links, not invented work.
 */
export default function ServiceShowcase({ page }: { page: ServicePage }) {
  const { showcase } = page;
  return (
    <section className={styles.showcase} aria-labelledby="svc-showcase">
      <div className="container">
        <h2 id="svc-showcase" className={`display ${styles.title}`} data-reveal="chars">
          {showcase.title}
        </h2>

        {showcase.portfolio && (
          <ul role="list" className={styles.shelf} data-sp-shelf>
            {showcase.portfolio.map((b) => (
              <li key={b.title} className={styles.book} data-sp-cover>
                <div className={styles.cover} style={{ aspectRatio: `${b.cover.width} / ${b.cover.height}` }}>
                  <Image src={b.cover.src} alt={`${b.title} — ${b.author}, cover`} fill sizes="(min-width: 1024px) 18vw, 40vw" quality={80} style={{ objectFit: "cover" }} />
                </div>
                <p className={styles.caption}>
                  <span className={styles.bookTitle}>{b.title}</span>
                  <span className={styles.bookMeta}>{b.author}</span>
                  <span className={styles.bookKind}>Formatting sample</span>
                </p>
              </li>
            ))}
          </ul>
        )}

        <nav className={styles.related} aria-label="Related services">
          <p className={styles.relatedLabel}>Other services</p>
          <ul role="list">
            {showcase.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={styles.relLink}>
                  <span className={styles.relName}>{r.label}</span>
                  <span className={styles.relText}>{r.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
