import Image from "next/image";
import type { ServicePage } from "@/content/servicePages";
import { siteConfig } from "@/content/siteConfig";
import LeadForm from "@/components/Forms/LeadForm";
import styles from "./ServiceClosing.module.css";

/**
 * Conversion — the last spread of the book. Left: the live closing line over
 * the service's closing image. Right: the live "Ready to tell your tale?"
 * inquiry form (the same `project` form and /api/lead delivery as the live page).
 */
export default function ServiceClosing({ page }: { page: ServicePage }) {
  const { closing, final, images } = page;
  return (
    <section className={styles.closing} aria-labelledby="svc-final">
      <div className={styles.spread}>
        <div className={styles.left}>
          <div className={styles.media} data-sp-closing-media>
            <Image src={images.closing.src} alt="" fill quality={65} sizes="(min-width: 1024px) 50vw, 100vw" style={{ objectFit: "cover", objectPosition: images.closing.position }} />
            <span className={styles.shade} aria-hidden="true" />
          </div>
          <div className={styles.leftCopy}>
            <p className={`display ${styles.closingTitle}`} data-reveal="chars">
              {closing.title}
            </p>
            <p className={styles.closingText}>{closing.text}</p>
            <a href={siteConfig.contact.phone.href} className={styles.call}>
              <span>{siteConfig.cta.call.label}</span>
              {siteConfig.contact.phone.display}
            </a>
          </div>
        </div>

        <div className={styles.right}>
          <p className={styles.eyebrow}>{final.eyebrow}</p>
          <h2 id="svc-final" className={`serif ${styles.title}`} data-reveal="words">
            {final.title}
          </h2>
          <p className={styles.text}>{final.text}</p>
          <LeadForm form="project" tone="light" prefill={`I'm interested in ${page.name}.`} />
        </div>
      </div>
    </section>
  );
}
