import RichTitle from "@/components/UI/RichTitle";
import styles from "./SectionMark.module.css";

type Props = {
  /** Catalogue section number, e.g. "02" */
  no: string;
  label: string;
  title: string;
  id: string;
  intro?: string;
  align?: "split" | "center" | "stack";
  className?: string;
};

/**
 * The Services page reads like a publisher's catalogue: each section opens
 * with a section mark (§ + number on a ruled line, like a catalogue index),
 * then its title — distinct from the About page's book chapters.
 */
export default function SectionMark({ no, label, title, id, intro, align = "split", className }: Props) {
  return (
    <header className={[styles.head, styles[align], className].filter(Boolean).join(" ")}>
      <p className={styles.mark} data-reveal="fade">
        <span className={styles.no}>
          <i>§</i> {no}
        </span>
        <span className={styles.label}>{label}</span>
        <span className={styles.rule} aria-hidden="true" />
      </p>
      <RichTitle text={title} id={id} className={styles.title} />
      {intro && (
        <p className={`lead ${styles.intro}`} data-reveal="lines" data-reveal-delay="0.15">
          {intro}
        </p>
      )}
    </header>
  );
}
