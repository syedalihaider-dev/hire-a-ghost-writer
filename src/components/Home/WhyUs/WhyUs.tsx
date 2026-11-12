import Image from "next/image";
import { chapters, commitment, includes, simplerWay } from "@/content/homeContent";
import SectionHead from "@/components/UI/SectionHead";
import RichTitle from "@/components/UI/RichTitle";
import QuoteButton from "@/components/UI/QuoteButton";
import Button from "@/components/UI/Button";
import { siteConfig } from "@/content/siteConfig";
import TiltPlate from "./TiltPlate";
import styles from "./WhyUs.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 08 — reassurance in three movements (commitments → what's included →
 * a simpler way) scrolling beside a sticky render of our 3D book.
 */
export default function WhyUs() {
  return (
    <section className={`surface-light pad-md ${styles.why}`} aria-labelledby="why-title">
      <div className={`container ${styles.inner}`}>
        <SectionHead chapter={8} id="why-title" label={chapters.why.label} title={chapters.why.title} />

        <div className={styles.split}>
          <div className={styles.aside}>
            <TiltPlate>
              <Image src="/images/renders/book.png" alt="The Hire A Ghost Writer Now hardcover, rendered in 3D" width={980} height={1486} sizes="(min-width: 1024px) 36vw, 80vw" quality={85} />
            </TiltPlate>
          </div>

          <div className={styles.groups}>
            <div className={styles.group}>
              <p className="label label--accent">{commitment.eyebrow}</p>
              <ol role="list" className={styles.grid2} data-reveal-group="0.08">
                {commitment.items.map((item, i) => (
                  <li key={item.title} className={styles.item} data-reveal-item>
                    <span className="label">{pad(i + 1)}</span>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemText}>{item.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.group}>
              <p className="label label--accent">{chapters.includes.label}</p>
              <RichTitle as="h3" text={chapters.includes.title} className={styles.groupTitle} reveal="words" />
              <p className="lead" data-reveal="lines">
                {includes.text}
              </p>
              <ul role="list" className={styles.grid2} data-reveal-group="0.08">
                {includes.items.map((item, i) => (
                  <li key={item.title} className={styles.item} data-reveal-item>
                    <span className="label">{pad(i + 1)}</span>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                    <p className={styles.itemText}>{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.group}>
              <p className="label label--accent">{chapters.simpler.label}</p>
              <RichTitle as="h3" text={chapters.simpler.title} className={styles.groupTitle} reveal="words" />
              <p className="lead" data-reveal="lines">
                {simplerWay.text}
              </p>
              <ul role="list" className={styles.grid2} data-reveal-group="0.08">
                {simplerWay.items.map((item, i) => (
                  <li key={item.title} className={styles.item} data-reveal-item>
                    <span className="label">{pad(i + 1)}</span>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                    <p className={styles.itemText}>{item.text}</p>
                  </li>
                ))}
              </ul>
              <div className={styles.ctas}>
                <QuoteButton size="lg" variant="dark" />
                <Button href={siteConfig.cta.contact.href} variant="outline" size="lg">
                  {siteConfig.cta.contact.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
