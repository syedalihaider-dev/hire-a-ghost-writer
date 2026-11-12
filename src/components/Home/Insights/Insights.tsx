import Image from "next/image";
import Link from "@/components/UI/AppLink";
import { chapters, CHAPTER_NO, insights } from "@/content/homeContent";
import SectionHead from "@/components/UI/SectionHead";
import Button from "@/components/UI/Button";
import { ArrowUpRightIcon } from "@/components/UI/Icons";
import styles from "./Insights.module.css";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

/** 11 — insights as a publishing-house article index. */
export default function Insights() {
  const [featured, ...rest] = insights.items;
  return (
    <section className="surface-dark pad-md" aria-labelledby="insights-title">
      <div className="container">
        <SectionHead chapter={CHAPTER_NO.insights} id="insights-title" label={chapters.insights.label} title={chapters.insights.title} lead={insights.text}>
          <Button href={insights.allHref} variant="outline">
            All Articles
          </Button>
        </SectionHead>

        <div className={styles.layout}>
          <article className={styles.featured}>
            <Link href={featured.href} className={styles.featuredLink} data-cursor="Read">
              {featured.image && (
                <div className={styles.featuredImg} data-reveal="clip">
                  <Image src={featured.image} alt="" fill sizes="(min-width: 1024px) 46vw, 100vw" quality={75} />
                </div>
              )}
              <p className={styles.meta}>
                <span className="label label--accent">{featured.category}</span>
                <time className="label" dateTime={featured.date}>
                  {formatDate(featured.date)}
                </time>
              </p>
              <h3 className={`display ${styles.featuredTitle}`}>{featured.title}</h3>
              <p className={styles.excerpt}>{featured.excerpt}</p>
            </Link>
          </article>

          <ol role="list" className={styles.list}>
            {rest.map((post, i) => (
              <li key={post.href} data-reveal="up" data-reveal-delay={String(i * 0.06)}>
                <Link href={post.href} className={styles.row} data-cursor="Read">
                  <p className={styles.meta}>
                    <span className="label label--accent">{post.category}</span>
                    <time className="label" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </p>
                  <h3 className={styles.rowTitle}>{post.title}</h3>
                  <span className={styles.arrow} aria-hidden="true">
                    <ArrowUpRightIcon size={18} />
                  </span>
                  {post.image && (
                    <span className={styles.thumb} aria-hidden="true">
                      <Image src={post.image} alt="" fill sizes="220px" quality={60} />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
