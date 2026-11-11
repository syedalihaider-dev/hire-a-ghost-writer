"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";
import type { SceneProps } from "../SceneView";
import Studio from "../Objects/Studio";
import Book, { type BookControl } from "../Objects/Book";
import Dust from "../Objects/Dust";
import { useFirstFrame } from "../Objects/useFirstFrame";

/** Tier 1 — the finished book closes and settles as the story ends. */
export default function ContactScene({ onReady }: SceneProps) {
  useFirstFrame(onReady);
  const rig = useRef<THREE.Group>(null);
  const control = useRef<BookControl>({ open: 1 });
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const mobile = size.width < 768;

  useFrame((state, dt) => {
    const p = sceneState.contact.progress;
    control.current.open = Math.max(0, 0.95 - p * 1.4);
    const g = rig.current;
    if (!g) return;
    const x = 0;
    const y = viewport.height * 0.2;
    const s = Math.min(0.8, viewport.height * 0.2);
    easing.damp3(g.scale, [s, s, s], 0.3, dt);
    easing.damp3(g.position, [x, y + (1 - p) * -0.4, 0], 0.45, dt);
    easing.dampE(g.rotation, [-0.15 + (1 - p) * -0.5 - state.pointer.y * 0.12, 0.45 - p * 0.75 + state.pointer.x * 0.3, 0.05], 0.4, dt);
  });

  return (
    <>
      <color attach="background" args={["#0b0f19"]} />
      <Studio intensity={0.9} />
      <group ref={rig} scale={0.7}>
        <Float speed={1} rotationIntensity={0.12} floatIntensity={0.3}>
          <Book control={control} />
        </Float>
      </group>
      <Dust count={mobile ? 160 : 320} />
    </>
  );
}
