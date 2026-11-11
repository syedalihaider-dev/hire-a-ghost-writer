import { chapters, finalCta } from "@/content/homeContent";
import { siteConfig } from "@/content/siteConfig";
import GLStage from "@/components/WebGL/GLStage";
import RichTitle from "@/components/UI/RichTitle";
import LeadForm from "@/components/Forms/LeadForm";
import BookLineArt from "@/components/UI/BookLineArt";
import ContactMotion from "./ContactMotion";
import styles from "./Contact.module.css";

/** Contact — the story's conclusion: the finished book closes beside the project form. */
export default function Contact() {
  const { contact } = siteConfig;
  return (
    <section id="contact" className={`surface-ink pad-md ${styles.contact}`} data-gl data-contact aria-labelledby="contact-title">
      <div className={`container ${styles.inner}`}>
        <header className={styles.head}>
          <div className={styles.meta} data-reveal="fade">
            <span className="label label--accent">{chapters.contact.label}</span>
            <span className={styles.eyebrow}>{finalCta.eyebrow}</span>
          </div>
          <RichTitle text={chapters.contact.title} id="contact-title" className={styles.title} />
        </header>

        <div className={styles.grid}>
          <div className={styles.left}>
            <GLStage scene="contact" />
            <div className={styles.fallbackArt} data-gl-fallback aria-hidden="true">
              <BookLineArt />
            </div>
            <div className={styles.details}>
              <p className={styles.text}>{finalCta.text}</p>
              <a href={contact.phone.href} className={styles.phone}>
                {contact.phone.display}
              </a>
              <address className="label">{contact.address.display}</address>
            </div>
          </div>

          <div className={`surface-light ${styles.card}`} data-reveal="up">
            <LeadForm form="project" tone="light" />
          </div>
        </div>
      </div>
      <ContactMotion />
    </section>
  );
}
