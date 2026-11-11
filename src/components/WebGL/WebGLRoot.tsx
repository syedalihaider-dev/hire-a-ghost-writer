"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { canRunWebGL, setGLStatus, useGLStatus } from "@/lib/webgl";

// three / R3F / drei are only downloaded when a 3D section is about to be seen.
const SharedCanvas = dynamic(() => import("./SharedCanvas"), { ssr: false });

/**
 * Decides WebGL vs 2D fallback, and defers the whole 3D stack until a WebGL
 * section is within ~1.5 viewports — so it never competes with first load.
 */
export default function WebGLRoot() {
  const status = useGLStatus();

  useEffect(() => {
    if (!canRunWebGL()) {
      setGLStatus("off");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setGLStatus("loading");
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    document.querySelectorAll("[data-gl]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return status === "loading" || status === "on" ? <SharedCanvas /> : null;
}
