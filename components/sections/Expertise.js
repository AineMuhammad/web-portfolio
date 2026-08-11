"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    tag: "AI / CV",
    title: "Generative 3D & Computer Vision",
    body: "Architecting generative pipelines with diffusion and 3D reconstruction models (Meshy, Tripo 3D, Hunyuan3D) alongside object/camera placement algorithms, currently sharpened by an M.S. in AI at SUNY.",
    icon: "eye",
  },
  {
    tag: "3D SYSTEMS",
    title: "Real-Time Graphics & Environments",
    body: "Unreal Engine for cinematic environments and material shaders, Three.js / React Three Fiber / Blender for web-based interactive product configurators.",
    icon: "cube",
  },
  {
    tag: "CLOUD",
    title: "Serverless Architecture at Scale",
    body: "Designing and deploying high-concurrency AWS Lambda functions, API Gateway, S3, and RDS/PostgreSQL databases for production full-stack apps.",
    icon: "cloud",
  },
  {
    tag: "DATA",
    title: "Data Engineering & Pipelines",
    body: "Dataset curation, schema design, SQL optimization, and automated validation pipelines that keep production data clean at scale.",
    icon: "data",
  },
  {
    tag: "FULL-STACK",
    title: "Full-Stack Product Engineering",
    body: "Production-ready React.js and Python applications on serverless AWS architectures, supporting high-concurrency workloads with minimal latency.",
    icon: "stack",
  },
  {
    tag: "LEADERSHIP",
    title: "Technical Ownership & Mentorship",
    body: "Led delivery for enterprise clients like Walmart at ALL3D and mentored junior engineers through code reviews, CI/CD, and unit testing.",
    icon: "leadership",
  },
];

// Every card sits to the left of the one on top of it - a monotonic
// rightward shift per index, not an alternating zigzag - so the stack
// reads as one consistent fan rather than cards swapping sides. That means
// the footprint (card width + (N-1) * shift) compounds with card count, so
// - to stay overflow-safe at any viewport - CARD width itself is solved
// backwards from the available space instead of picked by hand: see the
// `lg:[--card-w:...]` rule below, which sets card width to
// (available width) / (1 + (N-1) * SHIFT_FRACTION) so the fanned footprint
// always exactly fills (never exceeds) the space it has, then caps it at
// CARD_MAX so it doesn't keep growing forever on ultrawide monitors.
// Below `lg` there usually isn't room for a fan at all, so it's disabled
// (shift 0) and cards fall back to a single comfortably-wide column.
const V_STAGGER_VH = 3.2;
// Bumped up from 12 to clear the pinned heading pill above the stack -
// otherwise the first card or two starts sticking while still partly
// behind it.
const V_BASE_VH = 28;

const ICONS = {
  eye: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M4 24c4.5-8 12-13 20-13s15.5 5 20 13c-4.5 8-12 13-20 13S8.5 32 4 24Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="24" cy="24" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" />
      <circle cx="39" cy="12" r="1.4" fill="currentColor" />
      <path d="M9 12L18 19M39 12L30 19" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  cube: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M24 6 41 15.5v17L24 42 7 32.5v-17L24 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 6v18M24 24 7 15.5M24 24l17-8.5M24 24v18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  cloud: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M14 33a8 8 0 0 1-1-15.9A10 10 0 0 1 32 12a8.5 8.5 0 0 1 6 15.7A7 7 0 0 1 34 33H14Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M17 39v-3M24 40v-4M31 39v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  data: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <ellipse cx="24" cy="11" rx="14" ry="5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 11v10c0 2.8 6.3 5 14 5s14-2.2 14-5V11M10 21v10c0 2.8 6.3 5 14 5s14-2.2 14-5V21"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  ),
  stack: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="6" y="9" width="30" height="20" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="20" width="29" height="19" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 27l-3 3 3 3M28 27l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  leadership: (props) => (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="24" cy="10" r="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10" cy="34" r="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="38" cy="34" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20.5 14 12.5 29.5M27.5 14l7.5 15.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
};

export default function Expertise() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const endRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      // A zero-height sentinel right after the last card, so it has a
      // "next" to shrink away from too, same as every other card - without
      // it the last card never receives this animation (nothing ever
      // scrolls over it) and stays full-size while every card before it
      // has shrunk, which is what made it look oversized relative to the
      // rest of the deck.
      const targets = [...cards, endRef.current];

      // As each next card (or, for the last real card, the trailing
      // sentinel) scrolls up to cover the current one, ease the current
      // card back - scaling it down slightly - so it reads as sliding
      // beneath the stack rather than just getting cut off. Stays fully
      // opaque throughout (no fade) so covered cards still read clearly.
      cards.forEach((card, i) => {
        const next = targets[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.94,
          filter: "blur(1px)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top 92%",
            end: "top 30%",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="px-4 md:px-6 py-14 md:py-20">
      <div className="max-w-[1880px] mx-auto">
        {/* Sticky, not static: this stays pinned near the top of the
            viewport for the whole fan-stack scroll below (which can run
            for several viewport-heights), instead of scrolling away in
            the first beat and leaving the section title-less for the rest
            of the interaction. No background/border - plain text like
            every other section heading - with pointer-events-none on the
            wrapper (re-enabled on just the text) so the empty space
            around it never blocks hover/interaction with cards beneath. */}
        <div className="sticky top-4 md:top-6 z-20 pb-6 md:pb-8 pointer-events-none">
          <Reveal>
            <div className="pointer-events-auto inline-block max-w-3xl">
              <Eyebrow className="mb-2">Expertise</Eyebrow>
              <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.03] text-4xl md:text-6xl">
                Six disciplines, one pipeline.
              </h2>
            </div>
          </Reveal>
        </div>

        {/* --card-w on the lg: rule solves (available width) / (1 + (N-1)
            * 0.45) for N=6 cards, i.e. 3.25 - hardcoded because Tailwind's
            class scanner reads this file as static text, so it can't see
            through a JS template literal. If pillars.length changes,
            recompute 3.25 as 1 + (pillars.length - 1) * 0.45 and update it
            (and the * 0.45 below, and the `${pillars.length - 1}` in the
            width style, which do stay JS-driven) together by hand. */}
        <div
          className="mx-auto [--card-w:clamp(280px,84vw,460px)] [--shift:0px] lg:[--card-w:min(calc((100vw-4rem)/3.25),480px)] lg:[--shift:calc(var(--card-w)*0.45)]"
          style={{ width: `calc(var(--card-w) + var(--shift) * ${pillars.length - 1})` }}
        >
          {pillars.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <div
                key={p.title}
                ref={(el) => (cardRefs.current[i] = el)}
                className="sticky pb-10 md:pb-14"
                style={{
                  top: `${V_BASE_VH + i * V_STAGGER_VH}vh`,
                  width: "var(--card-w)",
                  marginLeft: i === 0 ? 0 : `calc(var(--shift) * ${i})`,
                }}
              >
                <div className="group relative glass-opaque glass-hover rounded-[10px] overflow-hidden p-6 md:p-8 min-h-[340px] md:min-h-[400px] flex flex-col justify-center">
                  {/* Same flat glass background as every other card on the
                      site now (no more colored cover banner) - the icon
                      instead sits large and low-opacity behind the copy as
                      a decorative watermark, growing slightly on hover. */}
                  {Icon && (
                    <Icon
                      className="absolute -right-8 -bottom-8 w-44 h-44 md:w-56 md:h-56 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
                      style={{ color: "var(--accent)", opacity: 0.1 }}
                    />
                  )}
                  <span
                    className="absolute right-5 top-5 md:right-6 md:top-6 font-display text-xs font-medium px-2.5 py-1 rounded-[10px] text-dim surface-2"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Card height now comes from the min-h + centered flex
                      above, not from stacked content, so this can size
                      naturally - title still reserves 2 lines and the body
                      clamps to 4 (bumped from 3, there's more room now) so
                      cards with shorter copy don't end up different
                      heights. */}
                  <div className="relative">
                    <p className="text-xs font-medium tracking-[0.14em] uppercase text-dim">
                      {p.tag}
                    </p>
                    <h3 className="font-display font-medium tracking-tight text-2xl md:text-[1.75rem] mt-2 mb-1.5 leading-tight min-h-[3.75rem] md:min-h-[4.375rem]">
                      {p.title}
                    </h3>
                    <p className="text-dim leading-relaxed line-clamp-4">{p.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} aria-hidden className="h-px" />
        </div>
      </div>
    </section>
  );
}
