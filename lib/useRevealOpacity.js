"use client";

import { useScroll, useTransform, useReducedMotion } from "framer-motion";

// Fades an overlay in as its section enters the viewport and out as it
// leaves, so section content reads as "coming into view" while the camera
// approaches the matching waypoint behind it. Reduced-motion users skip the
// animation and get the content at full opacity immediately.
export function useRevealOpacity(ref) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.4"],
  });
  const animated = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return reduced ? 1 : animated;
}
