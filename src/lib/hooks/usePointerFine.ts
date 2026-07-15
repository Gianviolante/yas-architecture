"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** true su dispositivi con mouse/trackpad (hover + pointer fine). */
export function usePointerFine() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
