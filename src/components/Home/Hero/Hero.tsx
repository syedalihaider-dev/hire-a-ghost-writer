import Image from "next/image";
import { chapters, hero, marquee } from "@/content/homeContent";
import { siteConfig } from "@/content/siteConfig";
import QuoteButton from "@/components/UI/QuoteButton";
import Button from "@/components/UI/Button";
import { PhoneIcon } from "@/components/UI/Icons";
import HeroMotion from "./HeroMotion";
import styles from "./Hero.module.css";

const SEAL_TEXT = "Ghostwriting · Book Formatting · ";

/**
 * 01 — first fold. Editorial serif headline + copy + CTAs on the left, a
 * large, clearly visible manuscript photograph on the right. Everything fits
 * one desktop viewport.
 */
export default function Hero() {
  const { contact, cta } = siteConfig;
  return (
    <section className={`surface-ink ${styles.hero}`} data-hero aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy} data-hero-copy>
          <p className="label label--accent" data-hero-eyebrow>
            {chapters.hero.label}
          </p>

          <h1 id="hero-title" className={`serif ${styles.title}`} data-hero-title>
            {hero.titleLines[0]} <em>{hero.titleLines[1]}</em>
          </h1>

          <p className={styles.intro} data-hero-intro>
            {hero.intro}
          </p>

          <div className={styles.ctas} data-hero-cta>
            <QuoteButton size="lg" />
            <Button href={contact.phone.href} variant="outline" size="lg" icon={<PhoneIcon size={16} />}>
              {cta.call.label}
            </Button>
          </div>

          <ul role="list" className={styles.points} data-hero-points>
            {hero.points.map((p, i) => (
              <li key={p}>
                <span className="label label--accent">{String(i + 1).padStart(2, "0")}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <figure className={styles.visual} data-hero-visual>
          <span className={styles.frameLine} aria-hidden="true" data-hero-deco />
          <div className={styles.frame} data-hero-frame data-hero-image>
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              preload
              fetchPriority="high"
              quality={75}
              sizes="(min-width: 1024px) 46vw, 92vw"
              className={styles.image}
              data-hero-img
            />
            <figcaption className={styles.caption}>
              {marquee.map((m) => (
                <span key={m} className="label">
                  {m}
                </span>
              ))}
            </figcaption>
          </div>

          <div className={styles.seal} aria-hidden="true" data-hero-deco>
            <svg viewBox="0 0 120 120" className={styles.sealText}>
              <defs>
                <path id="hero-seal-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#hero-seal-path" textLength="286">{SEAL_TEXT}</textPath>
              </text>
            </svg>
            <Image src="/images/brand/icon-192.png" alt="" width={56} height={56} className={styles.sealMark} />
          </div>
        </figure>
      </div>

      <HeroMotion />
    </section>
  );
}
