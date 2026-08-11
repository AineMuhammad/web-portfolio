"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Drives the whole page's scroll physics (Lenis) and keeps GSAP's
// ScrollTrigger in sync with it, so any component can register
// scroll-linked animations against the real (smoothed) scroll position
// rather than the raw, un-eased browser scroll. Mounted once at the root
// layout. Respects prefers-reduced-motion by leaving native scrolling
// untouched - Lenis's easing is a motion effect, not just a convenience.
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Sections further down the page (Skills' pinned rail, in particular)
    // get their pin start/end positions measured once, early - but the
    // lazily-mounted 3D scenes above them (Jeep/Sofa canvases, dynamic
    // imports that swap in after their own GLB loads) change the page's
    // total height well after that initial measurement, leaving those
    // positions stale. A scroll further down would then trigger a pin at
    // the wrong (too early) point, visually overlapping whatever section
    // is still on screen. Re-measuring on every total-height change (not
    // just window resize, which ScrollTrigger already handles on its own)
    // keeps every trigger position honest as content settles in.
    // Debounced - a refresh can itself resize pin spacers, and this keeps
    // that from cascading into a refresh loop, plus avoids re-measuring on
    // every single frame while something (Reveal animations, etc.) is
    // actively resizing content.
    let refreshTimer;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}
