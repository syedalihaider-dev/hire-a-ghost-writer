import { chapters, faq } from "@/content/homeContent";
import { siteConfig } from "@/content/siteConfig";
import SectionHead from "@/components/UI/SectionHead";
import Accordion from "./Accordion";
import styles from "./FAQ.module.css";

/** 11 (cont.) — frequently asked questions. */
export default function FAQ() {
  const { contact } = siteConfig;
  return (
    <section id="faq" className="surface-light pad-md" aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside}>
          <SectionHead id="faq-title" label={chapters.faq.label} title={chapters.faq.title} align="stack" />
          <p className={styles.help} data-reveal="up">
            <span className="label">Call us</span>
            <a href={contact.phone.href} className={styles.phone}>
              {contact.phone.display}
            </a>
          </p>
        </div>
        <Accordion items={faq.items} />
      </div>
    </section>
  );
}
