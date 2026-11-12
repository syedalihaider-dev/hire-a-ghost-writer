import type { ReactNode } from "react";
import { TOTAL_CHAPTERS } from "@/content/homeContent";
import RichTitle from "./RichTitle";
import styles from "./SectionHead.module.css";

type Props = {
  chapter?: number;
  label: string;
  title: string;
  id: string;
  lead?: ReactNode;
  align?: "split" | "stack" | "center";
  className?: string;
  children?: ReactNode;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Agency section header: [ 03 / 11 ] + [ LABEL ] on a hairline, then a giant
 * condensed headline; optional lead aligned to the right column.
 */
export default function SectionHead({ chapter, label, title, id, lead, align = "split", className, children }: Props) {
  return (
    <header className={[styles.head, styles[align], className].filter(Boolean).join(" ")}>
      <div className={styles.meta} data-reveal="fade">
        <span className="label label--accent">{label}</span>
        {chapter !== undefined && (
          <span className="label">
            {pad(chapter)} / {pad(TOTAL_CHAPTERS)}
          </span>
        )}
      </div>
      <RichTitle text={title} id={id} className={styles.title} />
      {(lead || children) && (
        <div className={styles.side}>
          {lead && (
            <p className="lead" data-reveal="lines" data-reveal-delay="0.2">
              {lead}
            </p>
          )}
          {children && (
            <div data-reveal="up" data-reveal-delay="0.3">
              {children}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
