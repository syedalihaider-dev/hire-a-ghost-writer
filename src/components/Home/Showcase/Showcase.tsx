import Image from "next/image";
import type { CSSProperties } from "react";
import { chapters, formatting, portfolio, TOTAL_CHAPTERS } from "@/content/homeContent";
import SectionHead from "@/components/UI/SectionHead";
import CoverImage from "@/components/UI/CoverImage/CoverImage";
import ShowcaseMotion from "./ShowcaseMotion";
import styles from "./Showcase.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Art direction per work: each plate is lit in the cover's own palette, so the
 * exhibition reads as four distinct pieces rather than a grid of cards.
 * `sizes` follow the rendered book width in each slot.
 */
const PLATES = [
  { tone: "#2c3d47", light: "#7895a1", sizes: "(min-width: 1024px) 24vw, (min-width: 768px) 34vw, 52vw" },
  { tone: "#2a1f3d", light: "#86578f", sizes: "(min-width: 1024px) 18vw, (min-width: 768px) 26vw, 32vw" },
  { tone: "#1f2549", light: "#5d6cad", sizes: "(min-width: 1024px) 13vw, (min-width: 768px) 26vw, 32vw" },
  { tone: "#3a1d18", light: "#a5543a", sizes: "(min-width: 1024px) 13vw, (min-width: 768px) 24vw, 36vw" },
] as const;

/**
 * 05 — the finished product. An editorial exhibition, not a card grid: one
 * featured work set like a magazine spread, then three works at different
 * scales and heights, each on its own lit plate. Every portfolio item is
 * visible in the HTML; motion only enhances it. Then the formatting standards,
 * set over typeset pages.
 */
export default function Showcase() {
  const [featured, ...rest] = portfolio.items;
  const work = (item: (typeof portfolio.items)[number], i: number) => {
    const p = PLATES[i];
    return (
      <div
        className={styles.plate}
        style={{ "--tone": p.tone, "--light": p.light } as CSSProperties}
        data-plate
      >
        <span className={styles.plateBg} data-plate-bg />
        <span className={`display ${styles.numeral}`} aria-hidden="true" data-plate-num>
          {pad(i + 1)}
        </span>
        <span className={styles.floor} aria-hidden="true" data-plate-floor />
        <div className={styles.bookWrap} data-plate-book>
          <Image
            src={item.render.src}
            alt={`${item.title} by ${item.author} — finished hardcover, formatting sample`}
            width={item.render.width}
            height={item.render.height}
            sizes={p.sizes}
            quality={75}
            className={styles.book}
          />
        </div>
      </div>
    );
  };

  const caption = (item: (typeof portfolio.items)[number], i: number, big = false) => (
    <div className={`${styles.caption} ${big ? styles.captionBig : ""}`} data-caption>
      <p className={styles.capMeta} data-cap-fade>
        <span className={styles.no}>No. {pad(i + 1)}</span>
        <span className="label">Formatting sample</span>
      </p>
      <h3 id={`work-${i}`} className={`serif ${styles.capTitle}`} data-cap-title>
        {item.title}
      </h3>
      <p className={styles.capAuthor} data-cap-fade>
        {item.author}
      </p>
    </div>
  );

  return (
    <section className={`surface-dark ${styles.showcase}`} aria-labelledby="showcase-title" data-showcase>
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
        <h2 id="showcase-title" className={`serif ${styles.lead}`} data-reveal="lines">
          {portfolio.lead}
        </h2>
        <p className={styles.text} data-reveal="lines" data-reveal-delay="0.15">
          {portfolio.text}
        </p>
      </div>

      <div className="container">
        <ol role="list" className={styles.exhibit}>
          <li className={`${styles.work} ${styles.featured}`} data-work data-featured>
            <article className={styles.spread} aria-labelledby="work-0">
              {work(featured, 0)}
              <div className={styles.side}>
                {/* Contents page of the exhibition — a reading aid, the works themselves follow */}
                <div className={styles.contents} aria-hidden="true" data-cap-fade>
                  <span className="label label--accent">Contents</span>
                  <ol role="list">
                    {portfolio.items.map((item, i) => (
                      <li key={item.title} data-current={i === 0 || undefined}>
                        <span className={styles.cNo}>{pad(i + 1)}</span>
                        <span className={styles.cTitle}>{item.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                {caption(featured, 0, true)}
              </div>
            </article>
          </li>
          {rest.map((item, j) => {
            const i = j + 1;
            return (
              <li key={item.title} className={`${styles.work} ${styles[`w${i + 1}`]}`} data-work data-depth={[0, 6, 14, 9][i]}>
                <article aria-labelledby={`work-${i}`}>
                  {work(item, i)}
                  {caption(item, i)}
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={`pad-md ${styles.formatting}`}>
        <CoverImage src="/images/editorial/typeset-book-stack.jpg" tone="navy" shade={0.84} position="50% 60%" />
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

      <ShowcaseMotion />
    </section>
  );
}
