"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/** Calls `onReady` once, after the scene's first rendered frame. */
export function useFirstFrame(onReady: () => void) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(onReady);
  });
}
