import { terms } from "@/content/servicesContent";
import { renderRich } from "@/components/UI/RichTitle";
import styles from "./Terms.module.css";

/**
 * Why choose us — set like the terms of an agreement: a gold seal at the
 * centre (its engraved ring turns with scroll) and six clauses arranged
 * around it. The clause wording is the live site's, unchanged.
 */
export default function Terms() {
  const left = terms.clauses.slice(0, 3);
  const right = terms.clauses.slice(3);
  const clause = (c: (typeof terms.clauses)[number], i: number) => (
    <li key={c.title} className={styles.clause} data-clause>
      <span className={styles.section}>&sect; {i + 1}</span>
      <h3 className={`serif ${styles.cTitle}`}>{c.title}</h3>
      <p className={styles.cText}>{c.text}</p>
    </li>
  );
  const ring = terms.seal.repeat(2);

  return (
    <section className={`surface-light ${styles.terms}`} aria-labelledby="terms-title">
      <div className="container">
        <p className={styles.mark} data-reveal="fade">
          <span className={styles.no}>
            <i>&sect;</i> 04
          </span>
          <span className={styles.label}>{terms.label}</span>
        </p>
        <h2 id="terms-title" className={`display ${styles.title}`} data-reveal="chars">
          {renderRich(terms.title)}
        </h2>

        <div className={styles.layout}>
          <ol role="list" className={`${styles.col} ${styles.left}`}>
            {left.map((c, i) => clause(c, i))}
          </ol>

          <div className={styles.seal} aria-hidden="true">
            <svg viewBox="0 0 300 300" className={styles.ring} data-seal-ring>
              <defs>
                <path id="sealPath" d="M150,150 m-118,0 a118,118 0 1,1 236,0 a118,118 0 1,1 -236,0" />
              </defs>
              <circle cx="150" cy="150" r="140" className={styles.outer} />
              <circle cx="150" cy="150" r="96" className={styles.inner} />
              <text className={styles.ringText}>
                <textPath href="#sealPath" textLength="736">
                  {ring}
                </textPath>
              </text>
            </svg>
            <span className={styles.core} data-seal-core>
              <span className={styles.coreMono}>HGWN</span>
              <span className={styles.coreSerif}>Yours</span>
            </span>
          </div>

          <ol role="list" className={`${styles.col} ${styles.right}`} start={4}>
            {right.map((c, i) => clause(c, i + 3))}
          </ol>
        </div>
      </div>
    </section>
  );
}
