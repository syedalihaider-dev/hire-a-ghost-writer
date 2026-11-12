import Image from "next/image";
import type { ServicePage } from "@/content/servicePages";
import QuoteButton from "@/components/UI/QuoteButton";
import Link from "@/components/UI/AppLink";
import styles from "./ServiceHero.module.css";

/**
 * Hero — the book's jacket. One service is presented as one edition: the
 * service's cover art wrapped on a standing hardcover (spine, page block,
 * a gold ribbon marker), the live headline set beside it. Tinted per service.
 */
export default function ServiceHero({ page }: { page: ServicePage }) {
  const { hero, images } = page;
  return (
    <section className={styles.hero} aria-labelledby="svc-title" data-sp-hero>
      <span className={styles.wash} aria-hidden="true" data-sp-wash />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.crumbs} data-sp-fade>
            <Link href="/services/">Services</Link>
            <span aria-hidden="true" className={styles.crumbRule} />
            <span aria-current="page">{page.name}</span>
          </p>
          <h1 id="svc-title" className={`display ${styles.title}`} data-sp-title>
            {hero.title}
          </h1>
          <p className={`serif ${styles.tagline}`} data-sp-tagline>
            {page.tagline}
          </p>
          <p className={styles.lead} data-sp-lead>
            {hero.lead}
          </p>
          <div className={styles.ctas} data-sp-cta>
            <QuoteButton size="lg" prefill={`I'm interested in ${page.name}.`}>
              {hero.cta}
            </QuoteButton>
            <a href="#process" className={styles.textLink}>
              <span>How it works</span>
              <span className={styles.textLine} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.stage} data-sp-stage>
          <div className={styles.book} data-sp-book>
            <span className={styles.pages} aria-hidden="true" />
            <span className={styles.spine} aria-hidden="true">
              <span>{page.kind}</span>
            </span>
            <div className={styles.jacket}>
              <Image src={images.hero.src} alt={images.hero.alt} fill priority quality={80} sizes="(min-width: 1024px) 30vw, 70vw" style={{ objectFit: "cover", objectPosition: images.hero.position }} />
              <span className={styles.jacketShade} aria-hidden="true" />
              <span className={styles.jacketType} aria-hidden="true">
                <span className={styles.jacketKicker}>Hire A Ghost Writer Now</span>
                <span className={styles.jacketTitle}>{page.kind}</span>
                <span className={styles.jacketRule} />
                <span className={styles.jacketFoot}>Written in your voice</span>
              </span>
            </div>
            <span className={styles.ribbon} aria-hidden="true" data-sp-ribbon />
          </div>
          <span className={styles.floor} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
