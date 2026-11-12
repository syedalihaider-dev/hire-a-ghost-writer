import Image from "next/image";
import type { ServicePage } from "@/content/servicePages";
import styles from "./ServiceExpertise.module.css";

/**
 * Expertise — a typographic compass. The service's four named qualities
 * (live copy) sit at the four points around a circular plate that opens as
 * the section is read; each quality lights in turn. No icons, no cards.
 */
export default function ServiceExpertise({ page }: { page: ServicePage }) {
  const { expertise, images } = page;
  return (
    <section className={styles.expertise} aria-labelledby="svc-expertise" data-sp-expertise>
      <div className="container">
        <header className={styles.head}>
          <h2 id="svc-expertise" className={`display ${styles.title}`} data-reveal="chars">
            {expertise.title}
          </h2>
          <p className={styles.intro} data-reveal="lines" data-reveal-delay="0.15">
            {expertise.text}
          </p>
        </header>

        <div className={styles.compass}>
          <div className={styles.plate} data-sp-plate>
            <Image src={images.expertise.src} alt={images.expertise.alt} fill quality={70} sizes="(min-width: 1024px) 30vw, 80vw" style={{ objectFit: "cover", objectPosition: images.expertise.position }} />
          </div>
          <span className={styles.ring} aria-hidden="true" />
          <ol role="list" className={styles.points}>
            {expertise.items.map((q, i) => (
              <li key={q} className={`${styles.point} ${styles[`p${i + 1}`]}`} data-sp-point>
                <span className={styles.pNo}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.pTitle}>{q}</h3>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
