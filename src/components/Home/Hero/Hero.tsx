import Image from "next/image";
import { chapters, hero, marquee } from "@/content/homeContent";
import { siteConfig } from "@/content/siteConfig";
import QuoteButton from "@/components/UI/QuoteButton";
import Button from "@/components/UI/Button";
import { PhoneIcon } from "@/components/UI/Icons";
import Book3D from "@/components/UI/Book3D/Book3D";
import HeroMotion from "./HeroMotion";
import styles from "./Hero.module.css";

const SEAL_TEXT = "Ghostwriting · Book Formatting · ";
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 01 — first fold. Left: editorial serif headline, copy and CTAs. Right: a
 * layered still life — the manuscript photograph behind an arched window, a
 * loose manuscript leaf, and our hardcover (real CSS 3D) floating in front
 * of it: idea → manuscript → finished book, in one composition.
 */
export default function Hero() {
  const { contact, cta } = siteConfig;
  return (
    <section className={`surface-ink ${styles.hero}`} data-hero aria-labelledby="hero-title">
      <div className={styles.atmos} aria-hidden="true">
        <span className={styles.glow} data-hero-bg />
        <span className={`${styles.rule} ${styles.ruleB}`} data-hero-rule />
        <span className={`serif ${styles.watermark}`} data-hero-watermark>
          Manuscript
        </span>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy} data-hero-copy>
          <p className={`label label--accent ${styles.eyebrow}`} data-hero-eyebrow>
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
                <span className={styles.pointNo}>{pad(i + 1)}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} data-hero-visual>
          <span className={styles.archLine} aria-hidden="true" data-hero-arch-line />

          <figure className={styles.arch} data-hero-frame data-hero-image>
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              preload
              fetchPriority="high"
              quality={75}
              sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 64vw"
              className={styles.image}
              data-hero-img
            />
            <figcaption className={styles.caption}>
              {marquee.map((m) => (
                <span key={m} className="label" data-hero-tag>
                  {m}
                </span>
              ))}
            </figcaption>
          </figure>

          <div className={styles.sheet} aria-hidden="true" data-hero-sheet>
            <span className={styles.sheetHead}>Chapter One</span>
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i} className={styles.sheetLine} />
            ))}
          </div>

          <div className={styles.bookWrap} data-hero-book>
            <div data-hero-float>
              <Book3D width="var(--book-w)" open={-14} />
            </div>
          </div>

          <div className={styles.seal} aria-hidden="true" data-hero-seal>
            <svg viewBox="0 0 120 120" className={styles.sealText}>
              <defs>
                <path id="hero-seal-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#hero-seal-path" textLength="286">
                  {SEAL_TEXT}
                </textPath>
              </text>
            </svg>
            <Image src="/images/brand/icon-192.png" alt="" width={56} height={56} className={styles.sealMark} />
          </div>

          <p className={styles.vertical} aria-hidden="true" data-hero-vertical>
            <span>Idea</span>
            <i />
            <span>Manuscript</span>
            <i />
            <span>Book</span>
          </p>
        </div>
      </div>


      <HeroMotion />
    </section>
  );
}
