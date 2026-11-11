"use client";

import { lazy, Suspense } from "react";
import { View } from "@react-three/drei";
import type { SceneName } from "./GLStage";
import styles from "./GLStage.module.css";

export type SceneProps = { onReady: () => void };

const Contact = lazy(() => import("./Scenes/ContactScene"));
const MAP: Record<SceneName, React.LazyExoticComponent<(p: SceneProps) => React.JSX.Element>> = { contact: Contact };

/** A drei View (tracked DOM rect inside the shared canvas) hosting one scene. */
export default function SceneView({ scene, onReady }: { scene: SceneName; onReady: () => void }) {
  const Scene = MAP[scene];
  return (
    <View className={styles.view}>
      <Suspense fallback={null}>
        <Scene onReady={onReady} />
      </Suspense>
    </View>
  );
}
