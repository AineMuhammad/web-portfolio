"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useRevealOpacity } from "@/lib/useRevealOpacity";

// Wraps a section's content so it fades in as its waypoint comes into view
// behind it (see World.js / CameraRig.js) instead of appearing as a normal
// block in document flow. The <section> itself still occupies real layout
// height, which is what generates scroll progress for the camera path.
export default function SectionReveal({ id, className, as: Tag = "section", children }) {
  const ref = useRef(null);
  const opacity = useRevealOpacity(ref);

  return (
    <Tag id={id} ref={ref} className={className}>
      <motion.div style={{ opacity }}>{children}</motion.div>
    </Tag>
  );
}
