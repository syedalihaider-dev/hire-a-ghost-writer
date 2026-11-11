"use client";

import { useSyncExternalStore } from "react";

/**
 * WebGL availability, decided once on the client.
 *   pending → not decided yet (SSR + first client render)
 *   loading → capable; shared canvas is mounting
 *   on      → shared canvas mounted and rendering
 *   off     → 2D fallback (no WebGL, low-end device, save-data, reduced motion)
 */
export type GLStatus = "pending" | "loading" | "on" | "off";

let status: GLStatus = "pending";
const listeners = new Set<() => void>();

export function setGLStatus(next: GLStatus) {
  if (status === next) return;
  status = next;
  document.documentElement.classList.toggle("webgl-on", next === "on");
  listeners.forEach((l) => l());
}

export function useGLStatus() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    () => status,
    () => "pending" as GLStatus,
  );
}

type NavigatorExtras = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };

export function canRunWebGL() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if ((navigator.hardwareConcurrency || 8) < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
