import Image from "next/image";
import { catalogue } from "@/content/servicesContent";
import Link from "@/components/UI/AppLink";
import SectionMark from "./SectionMark";
import styles from "./Catalogue.module.css";

type Entry = (typeof catalogue.entries)[number];
const pad = (n: number) => String(n + 1).padStart(2, "0");

/** Frame proportion per composition — the art direction of the catalogue. */
const RATIO: Record<Entry["layout"], number> = {
  feature: 4 / 3,
  "feature-rev": 4 / 3,
  portrait: 4 / 5,
  "portrait-rev": 4 / 5,
  pair: 3 / 2,
};

function CatalogueEntry({ e, i }: { e: Entry; i: number }) {
  const sizes = e.layout === "pair" ? "(min-width: 1024px) 40vw, 92vw" : e.layout.startsWith("feature") ? "(min-width: 1024px) 56vw, 92vw" : "(min-width: 1024px) 34vw, 80vw";
  return (
    <article id={`service-${e.slug}`} className={`${styles.entry} ${styles[e.layout]}`} aria-labelledby={`svc-${e.slug}`} data-entry data-layout={e.layout}>
      <div className={styles.media} data-entry-media>
        <div className={styles.frame} style={{ aspectRatio: RATIO[e.layout] }} data-entry-frame>
          <div className={styles.img} data-entry-img>
            <Image src={e.image.src} alt={e.image.alt} fill sizes={sizes} quality={70} style={{ objectFit: "cover", objectPosition: e.image.position }} />
          </div>
          <span className={styles.frameNo} aria-hidden="true">
            {pad(i)}
          </span>
        </div>
      </div>

      <div className={styles.text}>
        <p className={styles.meta}>
          <span className={styles.no}>No. {pad(i)}</span>
          <span className={styles.kind}>{e.kind}</span>
        </p>
        <h3 id={`svc-${e.slug}`} className={`display ${styles.name}`} data-reveal="words">
          {e.name}
        </h3>
        <p className={styles.desc} data-reveal="lines">
          {e.description}
        </p>
        <Link href={e.href} className={styles.cta} data-cursor={catalogue.cta}>
          <span>
            {catalogue.cta} {e.name}
          </span>
          <span className={styles.ctaLine} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

/**
 * The catalogue — the heart of the page. Nine entries in deliberately varied
 * compositions (feature spreads, portraits, staggered pairs) on paper stock,
 * with a sticky contents rail. On desktop, the entry under the reader's
 * attention comes forward while the rest recede (CSS :has + ServicesMotion
 * perspective tilt). Every name, description and link is server-rendered.
 */
export default function Catalogue() {
  const rows: Entry[][] = [];
  catalogue.entries.forEach((e, i) => {
    const prev = rows[rows.length - 1];
    if (e.layout === "pair" && prev && prev.length === 1 && prev[0].layout === "pair") prev.push(e);
    else rows.push([e]);
    void i;
  });
  let n = 0;

  return (
    <section id="catalogue" className={`surface-light ${styles.catalogue}`} aria-labelledby="catalogue-title" data-catalogue>
      <div className="container">
        <SectionMark no="01" label={catalogue.label} title={catalogue.title} id="catalogue-title" intro={catalogue.intro} />
      </div>

      <div className={`container ${styles.body}`}>
        <nav className={styles.rail} aria-label="Catalogue contents">
          <ol role="list">
            {catalogue.entries.map((e, i) => (
              <li key={e.slug}>
                <a href={`#service-${e.slug}`} className={styles.railLink} data-rail={`service-${e.slug}`}>
                  <span className={styles.railNo}>{pad(i)}</span>
                  <span className={styles.railName}>{e.kind}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.list} data-catalogue-list>
          {rows.map((row) =>
            row.length === 2 ? (
              <div key={row[0].slug} className={styles.pairRow}>
                {row.map((e) => (
                  <CatalogueEntry key={e.slug} e={e} i={n++} />
                ))}
              </div>
            ) : (
              <CatalogueEntry key={row[0].slug} e={row[0]} i={n++} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
