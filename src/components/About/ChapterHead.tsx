import RichTitle from "@/components/UI/RichTitle";
import styles from "./ChapterHead.module.css";

type Props = {
  chapter: string;
  label: string;
  title?: string;
  id: string;
  intro?: string;
  align?: "split" | "center";
  className?: string;
};

/**
 * The About page reads like a book: every section opens with a chapter mark
 * (serif italic numeral + mono label on a drawn hairline), then its title.
 */
export default function ChapterHead({ chapter, label, title, id, intro, align = "split", className }: Props) {
  return (
    <header className={[styles.head, styles[align], className].filter(Boolean).join(" ")}>
      <p className={styles.mark} data-reveal="fade">
        <span className={styles.chapter}>{chapter}</span>
        <span className={styles.rule} aria-hidden="true" />
        <span className="label label--accent">{label}</span>
      </p>
      {title && <RichTitle text={title} id={id} className={styles.title} />}
      {intro && (
        <p className={`lead ${styles.intro}`} data-reveal="lines" data-reveal-delay="0.15">
          {intro}
        </p>
      )}
    </header>
  );
}
