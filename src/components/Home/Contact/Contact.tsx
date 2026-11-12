import { chapters, finalCta } from "@/content/homeContent";
import { siteConfig } from "@/content/siteConfig";
import { renderRich } from "@/components/UI/RichTitle";
import LeadForm from "@/components/Forms/LeadForm";
import Book3D from "@/components/UI/Book3D/Book3D";
import CoverImage from "@/components/UI/CoverImage/CoverImage";
import { PhoneIcon, PinIcon } from "@/components/UI/Icons";
import ContactMotion from "./ContactMotion";
import styles from "./Contact.module.css";

/**
 * Contact — the conclusion. A reader's evening scene sits under the section;
 * a controlled serif headline, the story's last line of copy, and the house
 * hardcover closing as you arrive (the story ends where yours begins), beside
 * the project form.
 */
export default function Contact() {
  const { contact } = siteConfig;
  return (
    <section id="contact" className={`surface-ink ${styles.contact}`} data-contact aria-labelledby="contact-title">
      <CoverImage src={finalCta.image.src} tone="ink" shade={0.72} position="30% 60%" />
      <span className={styles.frame} aria-hidden="true" data-contact-frame />

      <div className={`container ${styles.grid}`}>
        <div className={styles.left}>
          <div className={styles.meta} data-reveal="fade">
            <span className="label label--accent">{chapters.contact.label}</span>
            <span className={styles.rule} aria-hidden="true" />
          </div>

          <p className={styles.eyebrow} data-reveal="words">
            {finalCta.eyebrow}
          </p>

          <h2 id="contact-title" className={`serif ${styles.title}`} data-reveal="chars">
            {renderRich(chapters.contact.title)}
          </h2>

          <p className={styles.text} data-reveal="lines" data-reveal-delay="0.2">
            {finalCta.text}
          </p>

          <div className={styles.closing}>
            <div className={styles.bookSlot} data-contact-book>
              <Book3D width="var(--cbook-w)" pageTitle="The End" />
            </div>

            <div className={styles.details} data-reveal="up" data-reveal-delay="0.2">
              <a href={contact.phone.href} className={styles.phone}>
                <PhoneIcon size={18} />
                <span>{contact.phone.display}</span>
              </a>
              <address className={styles.address}>
                <PinIcon size={16} />
                <span>{contact.address.display}</span>
              </address>
            </div>
          </div>
        </div>

        <div className={`surface-light ${styles.card}`} data-reveal="up" data-reveal-delay="0.15">
          <LeadForm form="project" tone="light" />
        </div>
      </div>

      <ContactMotion />
    </section>
  );
}
