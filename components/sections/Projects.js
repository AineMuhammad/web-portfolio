"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import SceneFallback from "@/components/scenes/SceneFallback";
import PaintSwatches from "@/components/scenes/PaintSwatches";
import ProjectCarousel from "@/components/sections/ProjectCarousel";

// Mirrors JeepScene's own layout (canvas + paint row) so neither loading
// state causes a layout jump when the real scene mounts in over it.
function JeepFallback({ label }) {
  return (
    <div className="flex flex-col">
      <div className="h-[65vh] md:h-[85vh]">
        <SceneFallback label={label} />
      </div>
      <PaintSwatches disabled />
    </div>
  );
}

const JeepScene = dynamic(() => import("@/components/scenes/JeepScene"), {
  ssr: false,
  loading: () => <JeepFallback label="Loading jeep configurator…" />,
});

const configuratorStack = ["React Three Fiber", "Zustand", "postMessage API", "GLTF / Draco", "AWS S3 + CloudFront"];
const reconstructionStack = ["Blender", "Unreal Engine", "Florence-2", "Meshy / Tripo 3D", "Python"];

const otherProjects = [
  {
    title: "Leaf Lab",
    body: "An interactive educational web app teaching kids photosynthesis through hands-on simulation — add CO₂ and water, charge sunlight, run the reaction, and watch glucose and oxygen come out the other side.",
    stack: "React · TypeScript · Vite · Tailwind CSS · Framer Motion",
  },
  {
    title: "Pro Studio — 3D Room Layout Editor",
    body: "A browser-based 3D room design editor with first-person walkthrough, orbit, and top-down modes, running entirely client-side. Transform gizmos, collision detection, snap-to-surface placement, a live material editor, day/night lighting, and 100-step undo/redo.",
    stack: "React · Three.js · React Three Fiber · GLB parsing",
  },
  {
    title: "Health App Admin Portal",
    body: "An admin portal with drag-and-drop ordering, analytics dashboards, full CRUD operations, and secure image upload workflows.",
    stack: "React · Material UI · SWR",
  },
  {
    title: "Employee Management System",
    body: "A full-stack system with CSV-based user import tools, admin dashboards, and role-based access control.",
    stack: "React · Node.js · MySQL",
  },
];

export default function Projects() {
  // The jeep GLB is fetched lazily, only once this block is within reach of
  // the viewport rather than eagerly at page load.
  const jeepAnchorRef = useRef(null);
  const jeepApproaching = useInView(jeepAnchorRef, { once: true, margin: "800px 0px 800px 0px" });

  return (
    <section id="projects" className="py-14 md:py-20">
      <div className="max-w-[1880px] mx-auto px-4 md:px-6">
        <Reveal>
          <Eyebrow className="mb-4">Projects</Eyebrow>
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.03] text-4xl md:text-6xl max-w-2xl mb-8">
            Proof, not just description.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <Eyebrow className="mb-3">Featured project</Eyebrow>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-display font-medium tracking-tight text-2xl md:text-3xl">
              3D Truck Configurator
            </h3>
            <span className="h-7 px-2 rounded-[10px] bg-white flex items-center justify-center shrink-0">
              <Image
                src="/Logos/ALL3D.png"
                alt="ALL3D"
                width={64}
                height={32}
                className="h-4 w-auto object-contain"
              />
            </span>
          </div>
          <p className="text-dim leading-relaxed mb-6 max-w-3xl">
            An interactive 3D product configurator built with React, Three.js,
            and React Three Fiber, enabling real-time customization of
            vehicle color, parts, and environment lighting via PBR materials
            and HDRI maps. Architected a cross-window postMessage API for
            seamless third-party iframe embedding — the same pattern behind
            the enterprise configurators I led at ALL3D for clients including
            Walmart, Rough Country, and Telescope Casual Furniture. Drag to
            orbit, tap a swatch to repaint.
          </p>
          <div className="flex flex-wrap gap-2">
            {configuratorStack.map((s) => (
              <span key={s} className="glass text-xs font-normal px-3 py-1.5 rounded-[10px] text-dim">
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      <div
        ref={jeepAnchorRef}
        className="glass-subtle w-[95%] mx-auto mt-6 mb-8 rounded-[10px] overflow-hidden"
      >
        {jeepApproaching ? <JeepScene /> : <JeepFallback label="Scroll to load" />}
      </div>

      <div className="max-w-[1880px] mx-auto px-4 md:px-6">
        <Reveal as="div" className="max-w-3xl mb-8">
          <Eyebrow className="mb-3">Generative 3D</Eyebrow>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-display font-medium tracking-tight text-2xl md:text-3xl">
              Generative 3D Environment Reconstruction Platform
            </h3>
            <span className="w-7 h-7 rounded-[10px] bg-white flex items-center justify-center shrink-0 p-1">
              <Image
                src="/Logos/Sony.webp"
                alt="Sony Immersive Music Studio"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </span>
          </div>
          <p className="text-dim leading-relaxed mb-6">
            Built during my internship at Sony Immersive Music Studio: an
            AI pipeline that reconstructs immersive 3D scenes straight
            from 2D concept art, with automated camera placement and
            cinematic rendering in Unreal Engine.
          </p>
          <div className="flex flex-wrap gap-2">
            {reconstructionStack.map((s) => (
              <span key={s} className="glass text-xs font-normal px-3 py-1.5 rounded-[10px] text-dim">
                {s}
              </span>
            ))}
          </div>
        </Reveal>

      </div>

      {/* Label + carousel share one sticky-header treatment (same pattern
          as Expertise's pinned title): the label stays anchored above the
          cards for as long as this block is in view, instead of scrolling
          out of frame while a card is still being dragged into focus. No
          background/border - plain text - with pointer-events-none on the
          wrapper (re-enabled on just the text) so the empty space around
          it never blocks dragging the carousel underneath. */}
      <div className="relative">
        <div className="sticky top-4 md:top-6 z-20 max-w-[1880px] mx-auto px-4 md:px-6 pb-4 pointer-events-none">
          <Reveal as="div">
            <span className="pointer-events-auto inline-flex">
              <Eyebrow>More projects</Eyebrow>
            </span>
          </Reveal>
        </div>
        <Reveal as="div" delay={0.06}>
          <ProjectCarousel items={otherProjects} />
        </Reveal>
      </div>
    </section>
  );
}
