"use client";

import type { ReactNode } from "react";
import styles from "./WhyUs.module.css";

/** Depth tilt toward the pointer (mouse only), written to CSS variables. */
export default function TiltPlate({ children }: { children: ReactNode }) {
  return (
    <div
      className={styles.plate}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
        e.currentTarget.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`);
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--rx", "0deg");
        e.currentTarget.style.setProperty("--ry", "0deg");
      }}
    >
      <div className={styles.plateInner}>
        {/* parallax lives on its own element so it never fights the tilt transition */}
        <div data-parallax="6">{children}</div>
      </div>
    </div>
  );
}
