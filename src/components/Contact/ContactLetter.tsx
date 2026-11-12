import Image from "next/image";
import { contactLetter } from "@/content/contactContent";
import { siteConfig } from "@/content/siteConfig";
import LeadForm from "@/components/Forms/LeadForm";
import styles from "./ContactLetter.module.css";

/**
 * The letter — the live "Begin Your Project Now" inquiry, written as a letter
 * on studio letterhead. The form itself is the existing `project` form
 * (Full Name · Phone No · Email Address · Your Project Details) posting to
 * /api/lead exactly as before; only its typesetting changes ("letter" tone).
 */
export default function ContactLetter() {
  const l = contactLetter;
  const { brand, contact } = siteConfig;
  return (
    <section id="letter" className={styles.section} aria-labelledby="letter-title">
      <div className={`container ${styles.grid}`}>
        <aside className={styles.side}>
          <h2 id="letter-title" className={`display ${styles.title}`} data-reveal="chars">
            {l.title}
          </h2>
          <p className={styles.text} data-reveal="lines">
            {l.text}
          </p>

          <div className={styles.next}>
            <p className={styles.nextLabel}>{l.next.label}</p>
            <ol role="list">
              {l.next.steps.map((s, i) => (
                <li key={s.title} className={styles.step} data-ct-step>
                  <span className={styles.stepNo}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.stepText}>{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <div className={styles.paper} data-ct-paper>
          <header className={styles.letterhead}>
            <Image src={brand.logo.badge.src} alt="" width={56} height={56} className={styles.badge} />
            <span className={styles.lhName}>{brand.name}</span>
            <span className={styles.lhAddr}>{contact.address.display}</span>
          </header>
          <p className={styles.salutation}>{l.salutation}</p>
          <LeadForm form="project" tone="letter" />
          <p className={styles.signoff} aria-hidden="true">
            {l.signoff}
          </p>
        </div>
      </div>
    </section>
  );
}
