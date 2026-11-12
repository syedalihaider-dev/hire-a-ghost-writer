import Image from "next/image";
import { catalogue, servicesHero } from "@/content/servicesContent";
import { renderRich } from "@/components/UI/RichTitle";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./ServicesHero.module.css";

const h = servicesHero;
const pad = (n: number) => String(n + 1).padStart(2, "0");
const SPINES = ["Fiction", "Memoir", "Business"];

/**
 * Hero — a publisher's catalogue desk. Asymmetric: the headline and copy hold
 * the left; on the right a tall library plate, an inset photograph, a typed
 * catalogue index card and a stack of bound volumes overlap in depth. A
 * contents strip runs along the foot, indexing all nine services.
 * Choreography lives in ServicesMotion.
 */
export default function ServicesHero() {
  return (
    <section className={`surface-ink ${styles.hero}`} aria-labelledby="services-title" data-sv-hero>
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.light} data-sv-light />
        <span className={styles.rules} data-sv-rules>
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="label label--accent" data-sv-eyebrow>
            {h.eyebrow}
          </p>
          <h1 id="services-title" className={`display ${styles.title}`} data-sv-title>
            {renderRich(h.title)}
          </h1>
          <p className={styles.intro} data-sv-intro>
            {h.intro}
          </p>
          <div className={styles.ctas} data-sv-cta>
            <QuoteButton size="lg">{h.primary}</QuoteButton>
            <a href={h.secondary.href} className={styles.textLink}>
              <span>{h.secondary.label}</span>
              <span className={styles.textLine} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={styles.stage} data-sv-stage>
          <div className={styles.plate} data-sv-plate data-depth="0.5">
            <div className={styles.plateImg} data-sv-img>
              <Image
                src={h.image.src}
                alt={h.image.alt}
                fill
                priority
                quality={75}
                sizes="(min-width: 1024px) 36vw, 84vw"
                style={{ objectFit: "cover", objectPosition: h.image.position }}
              />
            </div>
            <span className={styles.plateShade} />
          </div>

          <div className={styles.inset} data-sv-inset data-depth="1.1">
            <Image src={h.inset.src} alt={h.inset.alt} fill quality={70} sizes="(min-width: 1024px) 16vw, 38vw" style={{ objectFit: "cover", objectPosition: h.inset.position }} />
          </div>

          {/* Catalogue index card — decorative */}
          <div className={styles.card} aria-hidden="true" data-sv-card data-depth="1.6">
            <span className={styles.punch} />
            <span className={styles.cardKicker}>{h.card.kicker}</span>
            <span className={styles.cardTitle}>{h.card.title}</span>
            {h.card.rows.map(([k, v]) => (
              <span key={k} className={styles.cardRow}>
                <span>{k}</span>
                <span>{v}</span>
              </span>
            ))}
            <span className={styles.stamp}>No. 001</span>
          </div>

          {/* bound volumes lying on the desk — decorative */}
          <div className={styles.spines} aria-hidden="true" data-sv-spines data-depth="2">
            {SPINES.map((s) => (
              <span key={s} className={styles.spine} data-sv-spine>
                <i />
                {s}
                <i />
              </span>
            ))}
          </div>

          <p className={styles.note} data-sv-detail>
            {h.note}
          </p>
        </div>

        <nav className={styles.contents} aria-label="Services in this catalogue" data-sv-contents>
          <span className={styles.contentsLabel}>Contents</span>
          <ol role="list">
            {catalogue.entries.map((e, i) => (
              <li key={e.slug}>
                <a href={`#service-${e.slug}`}>
                  <i>{pad(i)}</i> {e.kind}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
