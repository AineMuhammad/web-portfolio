"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThemeToggle from "./ThemeToggle";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const navRef = useRef(null);
  const eyebrowRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollCueRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const introTargets = [navRef.current, eyebrowRef.current, subtextRef.current, ctaRef.current];

    if (reducedMotion) {
      gsap.set(introTargets, { opacity: 1, y: 0 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(introTargets, { opacity: 0, y: 18 });
      gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(navRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0)
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.15)
        .to(
          [line1Ref.current, line2Ref.current],
          { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.1 },
          0.25
        )
        .to(subtextRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.75)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.9);

      gsap.to(scrollCueRef.current, {
        y: 8,
        duration: 1.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.6,
      });

      // Content eases up and fades as the hero scrolls past, so the next
      // section doesn't feel like it's just cutting in underneath it.
      gsap.to(contentRef.current, {
        yPercent: -12,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent)",
        }}
      />

      <nav
        ref={navRef}
        className="relative z-20 flex items-center justify-between px-4 md:px-8 pt-8"
      >
        <span className="font-display text-sm font-medium tracking-wide">
          Ain e Muhammad
        </span>
        <div className="glass-nav flex items-center gap-1 rounded-[10px] pl-2 pr-1 py-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden sm:inline px-3 py-1.5 rounded-[10px] text-sm text-dim hover:text-[var(--text)] transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)]"
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </nav>

      <div
        ref={contentRef}
        className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-8 py-24 pointer-events-none"
      >
        <p
          ref={eyebrowRef}
          className="inline-flex items-center gap-2 mb-6 text-sm text-dim w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-[10px]" style={{ background: "var(--accent)" }} />
          Reconstructing 2D into 3D since 2021
        </p>
        <h1 className="font-display font-medium tracking-tight leading-[1.05] text-[13vw] md:text-[6.2vw]">
          <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
            <span ref={line1Ref} className="block will-change-transform">
              Senior Software
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
            <span ref={line2Ref} className="block will-change-transform">
              Engineer, 3D &amp; AI
            </span>
          </span>
        </h1>
        <p ref={subtextRef} className="text-dim max-w-xl mt-8 text-lg leading-relaxed">
          I build real-time 3D experiences and the generative AI pipelines
          behind them, most recently at Sony Immersive Music Studio and
          ALL3D, where my work shipped product configurators for brands
          like Walmart.
        </p>
        <div ref={ctaRef} className="flex flex-wrap gap-3 mt-10 pointer-events-auto">
          <a
            href="#contact"
            className="btn-hover btn-solid-hover px-6 py-3.5 rounded-[10px] text-sm tracking-wide"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            Get in touch
          </a>
          <a
            href="#projects"
            className="glass btn-hover px-6 py-3.5 rounded-[10px] text-sm tracking-wide"
          >
            View work
          </a>
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="relative z-10 hidden sm:flex justify-center pb-10 pointer-events-none"
      >
        <span
          className="w-px h-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--text-dim), transparent)",
          }}
        />
      </div>
    </section>
  );
}
