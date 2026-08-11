"use client";

import { useEffect, useState } from "react";

const VARS = { accent: "--accent", accent2: "--accent-2", shard: "--shard" };
const FALLBACK = { accent: "#6ee7c0", accent2: "#f2a65a", shard: "#6ee7c0" };

export function useThemeColors() {
  const [colors, setColors] = useState(FALLBACK);

  useEffect(() => {
    function read() {
      const style = getComputedStyle(document.documentElement);
      const next = {};
      for (const key in VARS) {
        const v = style.getPropertyValue(VARS[key]).trim();
        next[key] = v || FALLBACK[key];
      }
      setColors(next);
    }
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}
