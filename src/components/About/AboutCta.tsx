import { aboutCta } from "@/content/aboutContent";
import { siteConfig } from "@/content/siteConfig";
import { renderRich } from "@/components/UI/RichTitle";
import CoverImage from "@/components/UI/CoverImage/CoverImage";
import QuoteButton from "@/components/UI/QuoteButton";
import Link from "@/components/UI/AppLink";
import styles from "./AboutCta.module.css";

/**
 * Epilogue. The page opened with a manuscript writing itself; it closes on a
 * blank first page with a blinking caret, waiting for the visitor's story.
 */
export default function AboutCta() {
  const c = aboutCta;
  const { phone } = siteConfig.contact;
  return (
    <section className={`surface-ink ${styles.cta}`} aria-labelledby="cta-title" data-about-cta>
      <CoverImage src={c.image.src} tone="ink" shade={0.9} position={c.image.position} />

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.mark} data-reveal="fade">
            <span className={styles.chapter}>{c.label}</span>
            <span className={styles.rule} aria-hidden="true" />
          </p>
          <h2 id="cta-title" className={`display ${styles.title}`} data-reveal="chars">
            {renderRich(c.title)}
          </h2>
          <p className={styles.text} data-reveal="lines" data-reveal-delay="0.2">
            {c.text}
          </p>
          <div className={styles.actions} data-reveal="up" data-reveal-delay="0.35">
            <QuoteButton size="lg" />
            <a href={phone.href} className={styles.phone}>
              <span className="label">{siteConfig.cta.call.label}</span>
              <span className={styles.phoneNo}>{phone.display}</span>
            </a>
            <Link href={c.contact.href} className={`link-line ${styles.contact}`}>
              {c.contact.label}
            </Link>
          </div>
        </div>

        <div className={styles.pageWrap} aria-hidden="true" data-cta-page>
          <div className={styles.page}>
            <span className={styles.pageKicker}>{c.page.chapter}</span>
            <span className={styles.pageRule} />
            {/* Full text is in the HTML; AboutMotion writes it out in step with scroll. */}
            <span className={styles.writing} data-cta-writing>
              <span className={styles.dropCap}>{c.page.story[0]}</span>
              <span data-cta-typed>{c.page.story.slice(1)}</span>
              <span className={styles.caret} data-cta-caret />
            </span>
            <span className={styles.prompt}>{c.page.prompt}</span>
          </div>
        </div>
      </div>

      <p className={`container ${styles.end}`} aria-hidden="true">
        <span className={styles.endRule} />
        <span className={styles.endText}>Fin &mdash; or the first page</span>
        <span className={styles.endRule} />
      </p>
    </section>
  );
}
