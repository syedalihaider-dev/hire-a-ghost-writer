import type { ServicePage } from "@/content/servicePages";
import { siteConfig } from "@/content/siteConfig";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./ServiceMidCta.module.css";

/** A bookmark between chapters: the live mid-page invitation, set like an inscription. */
export default function ServiceMidCta({ page }: { page: ServicePage }) {
  const { phone } = siteConfig.contact;
  return (
    <section className={styles.band} aria-labelledby="svc-mid">
      <div className={`container ${styles.inner}`}>
        <span className={styles.rule} aria-hidden="true" data-sp-mid-rule />
        <div className={styles.copy}>
          <h2 id="svc-mid" className={`serif ${styles.title}`} data-reveal="words">
            {page.midCta.title}
          </h2>
          <p className={styles.text}>{page.midCta.text}</p>
        </div>
        <div className={styles.actions} data-reveal="up">
          <QuoteButton variant="dark" size="lg" prefill={`I'm interested in ${page.name}.`}>
            {page.midCta.cta}
          </QuoteButton>
          <a href={phone.href} className={styles.call}>
            {page.midCta.call} <span>{phone.display}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
