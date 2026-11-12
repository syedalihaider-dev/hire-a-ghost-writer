import { chapters, CHAPTER_NO } from "@/content/homeContent";
import { pricing } from "@/content/siteConfig";
import SectionHead from "@/components/UI/SectionHead";
import QuoteButton from "@/components/UI/QuoteButton";
import styles from "./Pricing.module.css";

/** 07 — three editions; prices exactly as published (count up on reveal). */
export default function Pricing() {
  return (
    <section className={`surface-light pad-md ${styles.pricing}`} aria-labelledby="pricing-title">
      <div className="container">
        <SectionHead chapter={CHAPTER_NO.pricing} id="pricing-title" label={chapters.pricing.label} title={chapters.pricing.title} align="center" />

        <ul role="list" className={styles.plans} data-reveal-group="0.12">
          {pricing.plans.map((plan, i) => {
            const amount = parseFloat(plan.price.replace(/[^0-9.]/g, ""));
            return (
              <li key={plan.name} className={`${styles.plan} ${plan.featured ? "surface-dark" : ""}`} data-featured={plan.featured || undefined} data-reveal-item>
                <article aria-labelledby={`plan-${i}`} className={styles.inner}>
                  <header className={styles.top}>
                    <span className="label">Edition {String(i + 1).padStart(2, "0")}</span>
                    {plan.featured && <span className="label label--accent">Featured</span>}
                  </header>
                  <h3 id={`plan-${i}`} className={`display ${styles.name}`}>
                    {plan.name}
                  </h3>
                  <p className={styles.price}>
                    <span className={`display ${styles.amount}`}>
                      $<span data-count={amount} data-decimals="2">{amount.toFixed(2)}</span>
                    </span>
                    <span className="label">{plan.period}</span>
                  </p>
                  <ul role="list" className={styles.features}>
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <QuoteButton variant={plan.featured ? "solid" : "dark"} size="lg" prefill={`I'm interested in the ${plan.name} package (${plan.price} ${plan.period}).`} className={styles.select}>
                    Select Plan
                    <span className="visually-hidden">: {plan.name}</span>
                  </QuoteButton>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
