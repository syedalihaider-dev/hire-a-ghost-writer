"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";
import { dustFragment, dustVertex } from "../Shaders";

function buildGeometry(count: number) {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    pos.set([(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, -Math.random() * 8 + 2], i * 3);
    rand.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  return g;
}

/** Gold dust drifting through the light — motion computed on the GPU. */
export default function Dust({ count = 600 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);
  const geometry = useMemo(() => buildGeometry(count), [count]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uSize: { value: 55 }, uIntro: { value: 0 }, uColor: { value: new THREE.Color("#d9b26a") } },
      }),
    [],
  );

  useFrame((_, dt) => {
    if (!points.current) return;
    const u = (points.current.material as THREE.ShaderMaterial).uniforms;
    u.uTime.value += Math.min(dt, 0.05);
    u.uIntro.value = sceneState.intro;
    u.uPixelRatio.value = dpr;
  });

  useLayoutEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <points ref={points} args={[geometry, material]} frustumCulled={false} />;
}
