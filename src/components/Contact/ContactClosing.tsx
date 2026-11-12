import { contactClosing } from "@/content/contactContent";
import { renderRich } from "@/components/UI/RichTitle";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./ContactClosing.module.css";

/**
 * Closing — the postscript. A single line set large across the page, the
 * quote drawer (existing CTA) and a way back up to the letter.
 */
export default function ContactClosing() {
  const c = contactClosing;
  return (
    <section className={`surface-ink ${styles.closing}`} aria-labelledby="ps-title" data-ct-closing>
      <div className={`container ${styles.inner}`}>
        <p className={styles.ps} aria-hidden="true">
          P.S.
        </p>
        <h2 id="ps-title" className={`display ${styles.title}`} data-reveal="chars">
          {renderRich(c.title)}
        </h2>
        <p className={styles.text} data-reveal="lines">
          {c.text}
        </p>
        <div className={styles.actions} data-reveal="up">
          <QuoteButton size="lg">{c.cta}</QuoteButton>
          <a href={c.back.href} className="link-line">
            {c.back.label}
          </a>
        </div>
      </div>
    </section>
  );
}
