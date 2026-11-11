"use client";

import { useSyncExternalStore } from "react";

/** Global state for the "Get a Free Quote" drawer (opened from many CTAs). */
type QuoteState = { open: boolean; prefill: string };

let state: QuoteState = { open: false, prefill: "" };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const quoteStore = {
  open(prefill = "") {
    state = { open: true, prefill };
    emit();
  },
  close() {
    state = { ...state, open: false };
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => state,
};

const serverState: QuoteState = { open: false, prefill: "" };

export function useQuoteState() {
  return useSyncExternalStore(quoteStore.subscribe, quoteStore.get, () => serverState);
}
