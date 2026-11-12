import { finale } from "@/content/servicesContent";
import { siteConfig } from "@/content/siteConfig";
import { renderRich } from "@/components/UI/RichTitle";
import CoverImage from "@/components/UI/CoverImage/CoverImage";
import QuoteButton from "@/components/UI/QuoteButton";
import Link from "@/components/UI/AppLink";
import styles from "./Finale.module.css";

/**
 * The last chapter of the catalogue: a book that opens. On desktop the two
 * pages swing flat into a spread as the section arrives — the headline set on
 * the left page, the invitation and CTAs on the right.
 */
export default function Finale() {
  const { phone } = siteConfig.contact;
  return (
    <section className={`surface-ink ${styles.finale}`} aria-labelledby="finale-title" data-finale>
      <CoverImage src={finale.image.src} tone="ink" shade={0.9} position={finale.image.position} />

      <div className={`container ${styles.wrap}`}>
        <div className={styles.book} data-finale-book>
          <div className={`${styles.page} ${styles.left}`} data-finale-left>
            <p className={styles.eyebrow}>{finale.eyebrow}</p>
            <h2 id="finale-title" className={`display ${styles.title}`} data-reveal="chars">
              {renderRich(finale.title)}
            </h2>
            <span className={styles.folio} aria-hidden="true">
              p. 1
            </span>
          </div>
          <div className={`${styles.page} ${styles.right}`} data-finale-right>
            <span className={styles.ornament} aria-hidden="true" />
            <p className={styles.text}>{finale.text}</p>
            <div className={styles.actions}>
              <QuoteButton variant="dark" size="lg">
                {finale.cta}
              </QuoteButton>
              <a href={phone.href} className={styles.phone}>
                <span className={styles.phoneLabel}>{siteConfig.cta.call.label}</span>
                <span className={styles.phoneNo}>{phone.display}</span>
              </a>
            </div>
            <Link href={finale.contact.href} className={`link-line ${styles.contact}`}>
              {finale.contact.label}
            </Link>
            <span className={styles.folio} aria-hidden="true">
              p. 2
            </span>
          </div>
          <span className={styles.gutter} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
