import type Lenis from "lenis";

const reasons = new Set<string>();
let lenis: Lenis | null = null;

function apply() {
  if (!lenis) return;
  if (reasons.size > 0) lenis.stop();
  else lenis.start();
}

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  apply();
}

export function setLenisLocked(reason: string, locked: boolean) {
  if (locked) reasons.add(reason);
  else reasons.delete(reason);
  apply();
}
