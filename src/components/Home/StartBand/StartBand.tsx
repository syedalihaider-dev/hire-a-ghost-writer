import { chapters } from "@/content/homeContent";
import { genres, siteConfig } from "@/content/siteConfig";
import RichTitle from "@/components/UI/RichTitle";
import CoverImage from "@/components/UI/CoverImage/CoverImage";
import QuoteButton from "@/components/UI/QuoteButton";
import Button from "@/components/UI/Button";
import { PhoneIcon } from "@/components/UI/Icons";
import styles from "./StartBand.module.css";

/** 09 — "Not sure where to start?" band over a velocity-reactive outlined genre marquee. */
export default function StartBand() {
  const words = genres.map((g) => g.label);
  const row = (hidden: boolean) => (
    <ul role="list" className={styles.row} aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <li key={w}>
          <span className="label">{String(i + 1).padStart(2, "0")}</span>
          {w}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`surface-ink pad-md ${styles.band}`} aria-labelledby="start-title">
      <CoverImage src="/images/editorial/library-classic-books.jpg" tone="ink" shade={0.8} />
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track} data-marquee="-1">
          {row(true)}
          {row(true)}
        </div>
      </div>

      <div className={`container ${styles.inner}`}>
        <p className="label label--accent" data-reveal="fade">
          {chapters.start.label} · 09 / 11
        </p>
        <RichTitle text={chapters.start.title} id="start-title" className={styles.title} />
        <p className={`lead ${styles.text}`} data-reveal="lines">
          {chapters.start.text}
        </p>
        <div className={styles.ctas} data-reveal="up" data-reveal-delay="0.1">
          <QuoteButton size="lg" />
          <Button href={siteConfig.contact.phone.href} variant="outline" size="lg" icon={<PhoneIcon size={16} />}>
            {siteConfig.contact.phone.display}
          </Button>
        </div>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track} data-marquee="1">
          {row(true)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
