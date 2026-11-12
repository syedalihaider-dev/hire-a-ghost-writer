import { interlude, catalogue } from "@/content/servicesContent";
import { renderRich } from "@/components/UI/RichTitle";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./Interlude.module.css";

/**
 * A gold interstitial between chapters of the page: the live page's
 * "Start the Next Chapter of Your Story Today." over a slow ribbon of the
 * nine disciplines.
 */
export default function Interlude() {
  const names = catalogue.entries.map((e) => e.kind);
  return (
    <section className={styles.interlude} aria-labelledby="interlude-title">
      <div className={styles.ribbon} aria-hidden="true">
        <div className={styles.track} data-marquee="1">
          {[...names, ...names].map((n, i) => (
            <span key={i}>
              {n}
              <i aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
      <div className={`container ${styles.inner}`}>
        <h2 id="interlude-title" className={`display ${styles.title}`} data-reveal="chars">
          {renderRich(interlude.title)}
        </h2>
        <div data-reveal="up" data-reveal-delay="0.3">
          <QuoteButton variant="dark" size="lg">
            {interlude.cta}
          </QuoteButton>
        </div>
      </div>
    </section>
  );
}
