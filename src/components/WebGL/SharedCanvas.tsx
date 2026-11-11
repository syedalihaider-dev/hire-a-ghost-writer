"use client";

import { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor, View } from "@react-three/drei";
import { setGLStatus } from "@/lib/webgl";
import styles from "./SharedCanvas.module.css";

/** Flags WebGL as live only after the first frame, so 2D fallbacks never flash away early. */
function FirstFrame() {
  const [done, setDone] = useState(false);
  useFrame(() => {
    if (!done) {
      setDone(true);
      setGLStatus("on");
    }
  });
  return null;
}

/**
 * The ONE persistent canvas, fixed behind the page. Each WebGL section is a
 * drei <View>. The render loop only runs while at least one WebGL section is
 * on screen — otherwise the GPU is idle and scrolling costs nothing.
 */
export default function SharedCanvas() {
  const [dpr, setDpr] = useState(1.5);
  const [lost, setLost] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => () => setGLStatus("off"), []);

  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setActive(visible.size > 0);
      },
      { rootMargin: "200px 0px" },
    );
    const observe = () => document.querySelectorAll("[data-gl]").forEach((el) => io.observe(el));
    observe();
    // Sections mount progressively; pick up any that arrive later.
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  if (lost) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <Canvas
        eventSource={document.body}
        eventPrefix="client"
        dpr={dpr}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
        camera={{ position: [0, 0, 6], fov: 35 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", () => {
            setLost(true);
            setGLStatus("off");
          });
        }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(Math.min(1.75, window.devicePixelRatio))}
          onFallback={() => setDpr(1)}
        />
        <View.Port />
        <FirstFrame />
      </Canvas>
    </div>
  );
}
