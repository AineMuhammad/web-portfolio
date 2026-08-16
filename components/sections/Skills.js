"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const groups = [
  {
    tag: "AI & Machine Learning",
    items: ["Python (Advanced)", "PyTorch", "TensorFlow", "OpenCV", "Computer Vision", "Deep Learning", "Pandas", "NumPy", "Matplotlib", "RAG Pipeline Auditing", "Hallucination & Citation Testing", "Automated Benchmark Design", "LLM-as-System Evaluation"],
  },
  {
    tag: "Generative AI & Spatial Models",
    items: ["Meshy", "Tripo 3D", "Hunyuan3D", "Diffusion Models", "Image Segmentation Masks", "Camera & Object Placement Algorithms"],
  },
  {
    tag: "3D Visualization",
    items: ["Unreal Engine 5", "Blender (bpy)", "Three.js", "React Three Fiber", "WebGL", "3DS MAX", "GLTF Compression", "GPU Acceleration", "Level of Detail (LOD)", "Gaussian Splatting", "USD Pipeline", "MetaHuman", "Procedural Environment Generation"],
  },
  {
    tag: "Web & Full-Stack",
    items: ["JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", "Material UI", "SWR", "HTML5", "CSS3"],
  },
  {
    tag: "Cloud & DevOps",
    items: ["AWS Lambda", "API Gateway", "S3", "RDS", "EC2", "CloudFront", "Docker", "Git / GitHub", "CI/CD", "Unit Testing (Jest / Pytest)"],
  },
  {
    tag: "Databases",
    items: ["PostgreSQL (RDS)", "MySQL", "SQL", "Schema Design", "Query Optimization", "Data Validation"],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Pins the section and translates the card track horizontally in lockstep
  // with vertical scroll, so scrolling down reads through the deck left to
  // right before the page continues past it - the standard GSAP
  // pin+scrub recipe for a scroll-hijacked horizontal rail. Skipped
  // entirely for reduced motion: that group gets the plain, native
  // horizontally-scrollable row instead (see the conditional classes
  // below), since forcing vertical scroll input into horizontal motion is
  // itself a motion effect, not just a convenience.
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={
        reducedMotion
          ? "px-4 md:px-6 py-14 md:py-20"
          : "relative h-screen flex flex-col justify-center overflow-hidden"
      }
    >
      <div className="max-w-[1640px] mx-auto px-4 md:px-6 w-full">
        <Reveal>
          <Eyebrow className="mb-4">Skills</Eyebrow>
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.03] text-4xl md:text-6xl max-w-2xl mb-6 md:mb-8">
            The stack, grouped by what it does.
          </h2>
        </Reveal>
      </div>

      <div className="relative">
        <div
          className={
            reducedMotion
              ? "max-w-[1640px] mx-auto px-4 md:px-6 py-6 md:py-8 overflow-x-auto scrollbar-hide"
              : "pl-4 md:pl-6 py-6 md:py-8 overflow-hidden"
          }
        >
          <div
            ref={trackRef}
            className={`flex gap-6 md:gap-8 ${reducedMotion ? "snap-x snap-mandatory" : "will-change-transform"}`}
          >
            {groups.map((g, i) => {
              const cardClassName = `glass glass-hover shrink-0 w-[85vw] sm:w-[480px] md:w-[600px] lg:w-[660px] rounded-[10px] p-6 md:p-7 ${
                reducedMotion ? "snap-start" : ""
              }`;
              const cardContent = (
                <>
                  <p className="text-xs font-medium tracking-[0.14em] uppercase text-dim mb-3">
                    {g.tag}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs font-normal px-3 py-1 rounded-[10px] glass text-dim"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </>
              );

              // In pinned/horizontal mode, the scroll-driven translation is
              // itself the reveal - Reveal's own vertical-viewport trigger
              // would otherwise fire for every card at once as soon as the
              // section pins, since horizontal offset doesn't change a
              // card's vertical position. Only use Reveal for the
              // reduced-motion fallback, where cards actually do enter via
              // normal vertical scroll.
              return reducedMotion ? (
                <Reveal key={g.tag} delay={Math.min(i * 0.06, 0.24)} className={cardClassName}>
                  {cardContent}
                </Reveal>
              ) : (
                <div key={g.tag} className={cardClassName}>
                  {cardContent}
                </div>
              );
            })}
            {/* Trailing spacer so the last card clears the right edge with
                some breathing room instead of stopping flush against it. */}
            <div className="shrink-0 w-4 md:w-8" aria-hidden="true" />
          </div>
        </div>
        {!reducedMotion && (
          <div
            className="hidden md:block pointer-events-none absolute top-0 right-0 bottom-0 w-24"
            style={{ background: "linear-gradient(to right, transparent, var(--bg))" }}
          />
        )}
      </div>
    </section>
  );
}
