"use client";

import { useSyncExternalStore } from "react";

/**
 * Sound design generated with the Web Audio API — nothing to download or
 * license. Ambient: a low, slowly breathing chord through a lowpass filter.
 * Page-flip: a shaped burst of filtered noise. Tick: a short soft sine blip.
 * Audio only starts after an explicit user choice (the entry gate / toggle).
 */

const KEY = "hagwn:sound";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let enabled = false;
let lastTick = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function boot() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Ambient pad: A1 / E2 / A2 / C#3 detuned sines, slow tremolo, warm lowpass.
  ambient = ctx.createGain();
  ambient.gain.value = 0.05;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 520;
  ambient.connect(lp).connect(master);
  [55, 82.4, 110, 138.6].forEach((f, i) => {
    const o = ctx!.createOscillator();
    o.type = i % 2 ? "triangle" : "sine";
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 6;
    const g = ctx!.createGain();
    g.gain.value = 0.32 / (i + 1);
    const lfo = ctx!.createOscillator();
    lfo.frequency.value = 0.05 + i * 0.023;
    const lfoGain = ctx!.createGain();
    lfoGain.gain.value = 0.12 / (i + 1);
    lfo.connect(lfoGain).connect(g.gain);
    o.connect(g).connect(ambient!);
    o.start();
    lfo.start();
  });

  // Shared white-noise buffer for page flips.
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return ctx;
}

export const sound = {
  get enabled() {
    return enabled;
  },
  /** Restore the session preference (does not start audio without a gesture). */
  preference(): boolean | null {
    try {
      const v = sessionStorage.getItem(KEY);
      return v === null ? null : v === "1";
    } catch {
      return null;
    }
  },
  async setEnabled(on: boolean) {
    enabled = on;
    try {
      sessionStorage.setItem(KEY, on ? "1" : "0");
    } catch {
      /* storage blocked */
    }
    if (on) {
      const c = boot();
      if (!c || !master) return emit();
      if (c.state === "suspended") await c.resume().catch(() => {});
      master.gain.cancelScheduledValues(c.currentTime);
      master.gain.setTargetAtTime(0.9, c.currentTime, 0.6);
    } else if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
    }
    emit();
  },
  pageFlip(strength = 1) {
    if (!enabled || !ctx || !master || !noiseBuffer) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(900, t);
    bp.frequency.exponentialRampToValueAtTime(3800, t + 0.12);
    bp.frequency.exponentialRampToValueAtTime(1400, t + 0.32);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.16 * strength, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
    src.connect(bp).connect(g).connect(master);
    src.start(t);
    src.stop(t + 0.42);
  },
  tick() {
    if (!enabled || !ctx || !master) return;
    const now = performance.now();
    if (now - lastTick < 70) return;
    lastTick = now;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(1650, t);
    o.frequency.exponentialRampToValueAtTime(1100, t + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.035, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.08);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useSoundEnabled() {
  return useSyncExternalStore(sound.subscribe, () => enabled, () => false);
}
