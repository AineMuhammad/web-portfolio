"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Fades + slides content up once as it scrolls into view. GSAP/ScrollTrigger
// counterpart to SectionReveal (which ties opacity to the 3D camera path
// instead, for the sections that sit behind it) - use this for ordinary
// content blocks.
export default function Reveal({ as: Tag = "div", className, delay = 0, y = 24, children }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          // Once the reveal settles, drop the inline transform GSAP leaves
          // behind so CSS-driven hover effects (translate/scale) on the
          // same element aren't fighting a higher-specificity inline style.
          clearProps: "transform",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
