import Image from "next/image";
import { contactHero } from "@/content/contactContent";
import { siteConfig } from "@/content/siteConfig";
import { renderRich } from "@/components/UI/RichTitle";
import styles from "./ContactHero.module.css";

/**
 * Hero — correspondence. A letter is about to be written: an open envelope
 * on the desk, a photograph sliding out of it, a note card addressed to the
 * studio. The headline invites the conversation; the CTA scrolls to the
 * letter (the form) below.
 */
export default function ContactHero() {
  const h = contactHero;
  const { phone } = siteConfig.contact;
  return (
    <section className={`surface-ink ${styles.hero}`} aria-labelledby="contact-title" data-ct-hero>
      <span className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="label label--accent" data-ct-fade>
            {h.eyebrow}
          </p>
          <h1 id="contact-title" className={`display ${styles.title}`} data-ct-title>
            {renderRich(h.title)}
          </h1>
          <p className={`serif ${styles.kicker}`} data-ct-fade>
            {h.kicker}
          </p>
          <p className={styles.text} data-ct-text>
            {h.text}
          </p>
          <div className={styles.ctas} data-ct-cta>
            <a href={h.primary.href} className={styles.primary} data-magnetic>
              <span>{h.primary.label}</span>
              <span className={styles.primaryLine} aria-hidden="true" />
            </a>
            <a href={phone.href} className={styles.call}>
              <span className={styles.callLabel}>{siteConfig.cta.call.label}</span>
              <span className={styles.callNo}>{phone.display}</span>
            </a>
          </div>
        </div>

        <div className={styles.desk} aria-hidden="true" data-ct-desk>
          <div className={styles.envelope} data-ct-envelope>
            <span className={styles.back} />
            <div className={styles.photo} data-ct-photo>
              <Image src={h.image.src} alt="" fill priority quality={75} sizes="(min-width: 1024px) 32vw, 70vw" style={{ objectFit: "cover", objectPosition: h.image.position }} />
            </div>
            <span className={styles.pocket} />
            <span className={styles.flap} data-ct-flap />
            <span className={styles.seal} data-ct-seal>
              HG
            </span>
          </div>
          <div className={styles.card} data-ct-card>
            <span className={styles.cardRow}>
              <i>To</i>
              {h.envelope.to}
            </span>
            <span className={styles.cardRow}>
              <i>From</i>
              {h.envelope.from}
            </span>
            <span className={styles.cardNote}>{h.envelope.note}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
