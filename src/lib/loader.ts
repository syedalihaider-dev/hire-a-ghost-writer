/**
 * Tiny signal shared by the preloader and anything that should wait for it
 * (hero entrance, WebGL mount, ScrollTrigger refresh).
 */
let done = false;
const listeners = new Set<() => void>();

export function markLoaderDone() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onLoaderDone(fn: () => void) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export const isLoaderDone = () => done;
