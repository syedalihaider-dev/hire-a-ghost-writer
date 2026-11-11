import Image from "next/image";
import Link from "@/components/UI/AppLink";
import { serviceIndex, siteConfig } from "@/content/siteConfig";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./Footer.module.css";

/** Same value for every visitor, so it is cached rather than computed per request. */
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export default function Footer() {
  const { brand, contact, footer, social } = siteConfig;

  return (
    <footer id="site-footer" className={`surface-light ${styles.footer}`}>
      <div className="container">
        <div className={styles.top}>
          <p className={styles.tagline}>{brand.footerTagline}</p>
          <div className={styles.topActions}>
            <a href={contact.phone.href} className={styles.phone}>
              {contact.phone.display}
            </a>
            <QuoteButton variant="dark" size="lg" />
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.cols}>
            <div className={styles.badgeCol}>
              <Image src={brand.logo.badge.src} alt={brand.name} width={96} height={96} className={styles.badge} />
              <address className={styles.address}>
                <span className="label">Location</span>
                {contact.address.display}
              </address>
            </div>

            <nav aria-labelledby="f-links" className={styles.col}>
              <h2 id="f-links" className="label">
                Links
              </h2>
              <ul role="list">
                {footer.quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-line">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="f-services" className={`${styles.col} ${styles.wide}`}>
              <h2 id="f-services" className="label">
                Complete Writing and Publishing Support
              </h2>
              <ul role="list" className={styles.twoCol}>
                {serviceIndex.map((s) => (
                  <li key={s.label}>
                    {s.href ? (
                      <Link href={s.href} className="link-line">
                        {s.label}
                      </Link>
                    ) : (
                      <span>{s.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {social.length > 0 && (
              <nav aria-labelledby="f-social" className={styles.col}>
                <h2 id="f-social" className="label">
                  Follow
                </h2>
                <ul role="list">
                  {social.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-line">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            Copyright © <CopyrightYear /> {brand.legalName}.
          </p>
          <ul role="list" className={styles.legal}>
            {footer.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Single-line brand watermark, low opacity, cropped by the footer edge */}
      <p className={styles.watermark} aria-hidden="true" data-text="Hire A Ghost Writer Now" />
    </footer>
  );
}
