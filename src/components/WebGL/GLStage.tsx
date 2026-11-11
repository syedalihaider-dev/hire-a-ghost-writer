"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { useGLStatus } from "@/lib/webgl";
import styles from "./GLStage.module.css";

export type SceneName = "contact";

// One lazily-loaded module per scene so each section only pays for its own scene.
const SceneView = dynamic(() => import("./SceneView"), { ssr: false });

/**
 * Drop into any section marked `data-gl`. When WebGL is live it renders that
 * section's scene into the shared canvas (drei View tracks this element); the
 * section turns transparent only after its scene's first frame.
 */
export default function GLStage({ scene, className }: { scene: SceneName; className?: string }) {
  const status = useGLStatus();
  const ref = useRef<HTMLDivElement>(null);

  const onReady = useCallback(() => {
    ref.current?.closest("[data-gl]")?.setAttribute("data-gl-ready", "");
  }, []);

  useEffect(() => {
    if (status !== "on") ref.current?.closest("[data-gl]")?.removeAttribute("data-gl-ready");
  }, [status]);

  return (
    <div ref={ref} className={[styles.stage, className].filter(Boolean).join(" ")} aria-hidden="true">
      {status === "on" && <SceneView scene={scene} onReady={onReady} />}
    </div>
  );
}
