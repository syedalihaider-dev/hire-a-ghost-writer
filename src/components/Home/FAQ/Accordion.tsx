"use client";

import { useId, useState } from "react";
import { sound } from "@/lib/audio";
import { PlusIcon } from "@/components/UI/Icons";
import styles from "./FAQ.module.css";

type Item = { q: string; a: string };

/** Accessible disclosure accordion; height animates via CSS grid rows. Answers stay in the DOM. */
export default function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className={styles.accordion} data-reveal-group="0.04">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${base}-q${i}`;
        const panelId = `${base}-a${i}`;
        return (
          <div key={item.q} className={styles.item} data-open={isOpen || undefined} data-reveal-item>
            <h3>
              <button
                id={btnId}
                type="button"
                className={styles.q}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  sound.tick();
                  setOpen(isOpen ? null : i);
                }}
              >
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.qText}>{item.q}</span>
                <span className={styles.qIcon} aria-hidden="true">
                  <PlusIcon size={16} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className={styles.panel}>
              <div className={styles.panelInner} inert={!isOpen}>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
