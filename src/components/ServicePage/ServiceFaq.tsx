import type { ServicePage } from "@/content/servicePages";
import styles from "./ServiceFaq.module.css";

/**
 * FAQ — native <details>/<summary>: keyboard and screen-reader support for
 * free, zero JavaScript. Uses the service's own live FAQs where they exist,
 * otherwise the live site's general ghostwriting answers.
 */
export default function ServiceFaq({ page }: { page: ServicePage }) {
  const { faq } = page;
  return (
    <section className={styles.faq} aria-labelledby="svc-faq">
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          <h2 id="svc-faq" className={`display ${styles.title}`} data-reveal="chars">
            {faq.title}
          </h2>
          <p className={styles.note}>{faq.isGeneral ? "Common questions about working with our ghostwriters." : `About ${page.name.toLowerCase()}.`}</p>
        </div>
        <div className={styles.list}>
          {faq.items.map((item, i) => (
            <details key={item.q} className={styles.item} open={i === 0}>
              <summary className={styles.q}>
                <span className={styles.qNo}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.qText}>{item.q}</span>
                <span className={styles.qIcon} aria-hidden="true" />
              </summary>
              <p className={styles.a}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
