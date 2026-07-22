"use client";

import { useEffect, useState } from "react";

/**
 * Hydration-safe replacement for framer-motion's useReducedMotion.
 *
 * framer-motion's hook returns null on the server but true synchronously on
 * the first client render for reduced-motion users, so any render branch
 * keyed on it produces different SSR vs hydration markup — React 19 then
 * throws a hydration error and re-renders the whole page client-side.
 *
 * This hook returns false on the server AND the first client render (markup
 * always matches), then reflects the real prefers-reduced-motion setting
 * right after mount and tracks live changes.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return reduced;
}
