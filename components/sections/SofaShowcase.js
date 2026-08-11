"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import SceneFallback from "@/components/scenes/SceneFallback";

const SofaScene = dynamic(() => import("@/components/scenes/SofaScene"), {
  ssr: false,
  loading: () => <SceneFallback label="Loading sofa scene…" />,
});

// Sits between Hero and Expertise. The GLB is compressed but still worth
// deferring, so it isn't mounted until the canvas is within reach; the
// assembly animation only starts once the canvas itself actually scrolls
// into view (not just the section, which also includes the heading above
// it and would otherwise fire the trigger while the canvas is still
// off-screen below).
export default function SofaShowcase() {
  const canvasRef = useRef(null);
  const approaching = useInView(canvasRef, { once: true, margin: "800px 0px 800px 0px" });
  const play = useInView(canvasRef, { once: true, amount: 0.2 });

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1640px] mx-auto px-4 md:px-6">
        <Reveal>
          <Eyebrow className="mb-4">3D Asset Pipeline</Eyebrow>
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.03] text-4xl md:text-6xl max-w-2xl mb-6 md:mb-8">
            Assembled in real time.
          </h2>
        </Reveal>
      </div>
      <div
        ref={canvasRef}
        className="glass-subtle w-[95%] mx-auto h-[65vh] md:h-[85vh] rounded-[10px] overflow-hidden"
      >
        {approaching ? <SofaScene play={play} /> : <SceneFallback label="Scroll to load" />}
      </div>
    </section>
  );
}
