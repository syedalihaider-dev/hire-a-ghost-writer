import { contactDetails } from "@/content/contactContent";
import { siteConfig } from "@/content/siteConfig";
import Figure from "@/components/About/Figure";
import styles from "./ContactDetails.module.css";

/**
 * The studio — the business's real details, set like the address block on a
 * letter rather than a row of contact cards. Only data that exists in
 * siteConfig is shown (no email; social links render only if configured).
 */
export default function ContactDetails() {
  const { contact, social } = siteConfig;
  const a = contact.address;
  return (
    <section className={`surface-dark ${styles.details}`} aria-labelledby="studio-title">
      <div className={`container ${styles.grid}`}>
        <Figure image={contactDetails.image} ratio={4 / 5} sizes="(min-width: 1024px) 26vw, 70vw" className={styles.figure} parallax />

        <div className={styles.copy}>
          <p className="label label--accent" data-reveal="fade">
            {contactDetails.label}
          </p>
          <h2 id="studio-title" className={`display ${styles.title}`} data-reveal="chars">
            {contactDetails.title}
          </h2>

          <dl className={styles.list}>
            <div className={styles.row} data-ct-row>
              <dt>Address</dt>
              <dd>
                <address className={styles.address}>
                  {a.street}
                  <br />
                  {a.city}, {a.region} {a.postalCode}
                </address>
              </dd>
            </div>
            <div className={styles.row} data-ct-row>
              <dt>Telephone</dt>
              <dd>
                <a href={contact.phone.href} className={styles.phone}>
                  {contact.phone.display}
                </a>
              </dd>
            </div>
            <div className={styles.row} data-ct-row>
              <dt>Confidentiality</dt>
              <dd className={styles.small}>{siteConfig.footer.confidentiality}</dd>
            </div>
            {social.length > 0 && (
              <div className={styles.row} data-ct-row>
                <dt>Follow</dt>
                <dd className={styles.social}>
                  {social.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="link-line">
                      {s.label}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}
