import Image from "next/image";
import { chapters, formatting, portfolio, TOTAL_CHAPTERS } from "@/content/homeContent";
import SectionHead from "@/components/UI/SectionHead";
import styles from "./Showcase.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

// Real portfolio covers, rendered onto our 3D hardcover. Sizes/depths are art-directed.
const LAYOUT = [
  { cls: "featured", parallax: "4", src: "/images/portfolio/book-1.png" },
  { cls: "tall", parallax: "12", src: "/images/portfolio/book-2.png" },
  { cls: "small", parallax: "20", src: "/images/portfolio/book-3.png" },
  { cls: "medium", parallax: "8", src: "/images/portfolio/book-4.png" },
] as const;

/** 05 — the finished product: an editorial publishing portfolio, then interior formatting standards. */
export default function Showcase() {
  return (
    <section className={`surface-dark ${styles.showcase}`} aria-labelledby="showcase-title">
      <div className={styles.driftWrap} aria-hidden="true">
        <p className={`serif ${styles.drift}`} data-drift="-30" data-text="Portfolio — Sample Work — Portfolio — Sample Work" />
      </div>

      <div className={`container ${styles.head}`}>
        <div className={styles.meta} data-reveal="fade">
          <span className="label label--accent">{chapters.showcase.label}</span>
          <span className="label">
            05 / {pad(TOTAL_CHAPTERS)}
          </span>
        </div>
        <h2 id="showcase-title" className={`serif ${styles.lead}`} data-reveal="split">
          {portfolio.lead}
        </h2>
        <p className={styles.text} data-reveal="up">
          {portfolio.text}
        </p>
      </div>

      <div className="container">
      <ol role="list" className={styles.collage}>
        {portfolio.items.map((item, i) => {
          const l = LAYOUT[i];
          return (
            <li key={item.src} className={`${styles.item} ${styles[l.cls]}`}>
              <div data-parallax={l.parallax}>
                <figure className={styles.figure}>
                  <div className={styles.frame} data-reveal="clip">
                    <Image
                      src={l.src}
                      alt={`${item.title} — book cover sample`}
                      width={1000}
                      height={1490}
                      sizes={i === 0 ? "(min-width: 1024px) 34vw, 80vw" : "(min-width: 1024px) 22vw, 60vw"}
                      quality={80}
                      className={styles.book}
                    />
                  </div>
                  <figcaption className={styles.caption}>
                    <span className={styles.no}>No. {pad(i + 1)}</span>
                    <span className="label">Formatting sample</span>
                    <span className={`serif ${styles.capTitle}`}>{item.title}</span>
                    <span className={styles.capMeta}>{item.author}</span>
                  </figcaption>
                </figure>
              </div>
            </li>
          );
        })}
      </ol>
      </div>

      <div className={`pad-md ${styles.formatting}`}>
        <div className="container">
          <SectionHead id="formatting-title" label={chapters.formatting.label} title={chapters.formatting.title} lead={formatting.subtitle} />
          <ol role="list" className={styles.standards} data-reveal-group="0.1">
            {formatting.items.map((item, i) => (
              <li key={item.key} className={styles.standard} data-reveal-item>
                <span className={`display ${styles.outlineNum}`} aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <h3 className={styles.stdTitle}>{item.title}</h3>
                <p className={styles.stdText}>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
