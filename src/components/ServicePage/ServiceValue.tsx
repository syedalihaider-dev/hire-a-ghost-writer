import type { ServicePage } from "@/content/servicePages";
import styles from "./ServiceValue.module.css";

/**
 * What makes the service valuable — the studio's published commitments, set
 * as a single ruled ledger line that inks in from left to right. Copy is the
 * live homepage wording; nothing new is promised.
 */
export default function ServiceValue({ page }: { page: ServicePage }) {
  return (
    <section className={styles.value} aria-labelledby="svc-value">
      <div className="container">
        <h2 id="svc-value" className={`serif ${styles.title}`} data-reveal="words">
          {page.value.title}
        </h2>
        <ol role="list" className={styles.ledger} data-sp-ledger>
          {page.value.items.map((v, i) => (
            <li key={v.title} className={styles.item} data-sp-ledger-item>
              <span className={styles.no}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.itemTitle}>{v.title}</h3>
              <p className={styles.itemText}>{v.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
