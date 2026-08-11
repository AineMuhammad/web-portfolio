"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GAP = 24; // px, gap between cards used to derive the step distance
const EASE = 0.16;

const ChevronIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function ProjectCard({ p, className = "", style, refCb, ...rest }) {
  return (
    <div
      ref={refCb}
      className={`glass rounded-[10px] p-6 md:p-8 w-[78vw] sm:w-[380px] md:w-[400px] h-[280px] md:h-[300px] shrink-0 flex flex-col ${className}`}
      style={style}
      {...rest}
    >
      <h4 className="font-display font-medium tracking-tight text-lg mb-2">{p.title}</h4>
      <p className="text-dim text-sm leading-relaxed mb-3 line-clamp-5">{p.body}</p>
      <p className="text-xs font-normal tracking-[0.06em] text-dim mt-auto">{p.stack}</p>
    </div>
  );
}

// Shortest signed distance from `value` to the nearest number congruent to
// `target` modulo `n` - e.g. wrappedDelta(0, 3, 4) === -1 (one step back,
// not three forward). This is the only thing that makes the loop "endless":
// position is a plain, ever-growing/shrinking float, never reset or
// physically jumped, and every card's distance-from-center is recomputed
// fresh each frame straight from the maths, so there is nothing to visibly
// snap when it wraps.
function wrappedDelta(index, position, n) {
  let d = index - position;
  d -= n * Math.round(d / n);
  return d;
}

// The integer nearest to `target` that is congruent to `logicalIndex`
// modulo n - i.e. the shortest-path whole step to land exactly on that
// card. Wrapping has to happen on the fractional target itself (not on a
// pre-rounded copy of it), otherwise which direction is actually shorter
// can come out wrong right at the boundary between two candidates.
function nearestCongruent(target, logicalIndex, n) {
  let diff = logicalIndex - target;
  diff -= n * Math.round(diff / n);
  return Math.round(target + diff);
}

// A JS-driven coverflow instead of a native-scroll one: a single float
// (position) is the sole source of truth, eased toward a target each
// frame and rendered straight into each card's transform. Earlier drafts
// drove this off real scrollLeft + a tripled DOM list + a "snap back into
// the middle copy" correction, which could desync from an in-flight
// smooth-scroll (skipping a card) or visibly hiccup at the recenter point
// (the loop "jump"). Doing it in plain state removes both failure modes
// entirely - there's no scroll position to fight and no recenter to
// notice.
function DepthCarousel({ items }) {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const rafRef = useRef(null);
  const stepPxRef = useRef(400);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const draggingRef = useRef(false);
  const dragRef = useRef(null);
  const justDraggedRef = useRef(false);
  const [activeDot, setActiveDot] = useState(0);
  const reducedMotion = useReducedMotion();
  const n = items.length;

  useEffect(() => {
    function measure() {
      const card = cardRefs.current[0];
      if (card) stepPxRef.current = card.offsetWidth + GAP;
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function render() {
      const stepPx = stepPxRef.current;
      items.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const d = wrappedDelta(i, positionRef.current, n);
        const absD = Math.min(Math.abs(d), 3);
        el.style.transform = `translate(-50%, -50%) translateX(${d * stepPx}px) translateZ(${-absD * 90}px) rotateY(${-Math.sign(d) * Math.min(absD, 1) * 30}deg) scale(${1 - Math.min(absD, 1) * 0.22})`;
        el.style.opacity = String(Math.max(0.06, 1 - absD * 0.4));
        el.style.filter = `blur(${Math.min(absD, 2.4) * 3.5}px) brightness(${1 - Math.min(absD, 2) * 0.2})`;
        el.style.zIndex = String(Math.round(200 - absD * 10));
        el.style.pointerEvents = absD < 0.6 ? "auto" : "none";
      });
    }

    function tick() {
      if (!draggingRef.current) {
        const diff = targetRef.current - positionRef.current;
        positionRef.current += diff * (reducedMotion ? 1 : EASE);
        if (Math.abs(diff) < 0.0008) positionRef.current = targetRef.current;
      }
      render();
      const logical = ((Math.round(positionRef.current) % n) + n) % n;
      setActiveDot((prev) => (prev === logical ? prev : logical));
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, reducedMotion]);

  // All navigation adjusts the committed target, not the live (still
  // easing) position - so clicking Next twice in quick succession always
  // advances by exactly two cards instead of the second click reading a
  // position that hasn't finished catching up to the first yet.
  function step(dir) {
    targetRef.current = Math.round(targetRef.current) + dir;
  }

  function goTo(logicalIndex) {
    targetRef.current = nearestCongruent(targetRef.current, logicalIndex, n);
  }

  function onCardClick(logicalIndex) {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    goTo(logicalIndex);
  }

  function onPointerDown(e) {
    draggingRef.current = true;
    justDraggedRef.current = false;
    dragRef.current = { startX: e.clientX, startPosition: positionRef.current };
    targetRef.current = positionRef.current;
    stageRef.current?.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 3) justDraggedRef.current = true;
    const next = dragRef.current.startPosition - dx / stepPxRef.current;
    positionRef.current = next;
    targetRef.current = next;
  }
  function endDrag(e) {
    if (!dragRef.current) return;
    dragRef.current = null;
    draggingRef.current = false;
    targetRef.current = Math.round(positionRef.current);
    try {
      stageRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  }

  function onWheel(e) {
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetRef.current += delta * 0.0028;
  }

  function onKeyDown(e) {
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  }

  return (
    <div className="relative">
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="More projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        className="relative h-[340px] md:h-[360px] select-none cursor-grab active:cursor-grabbing outline-none touch-none"
        style={{ perspective: "1600px" }}
      >
        {items.map((p, i) => (
          <ProjectCard
            key={p.title}
            p={p}
            refCb={(el) => (cardRefs.current[i] = el)}
            className="absolute top-1/2 left-1/2"
            style={{ willChange: "transform, opacity, filter" }}
            onClick={() => onCardClick(i)}
          />
        ))}
      </div>

      {/* Recede-into-fog edges, matching the horizontal fade already used
          on the Skills rail. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32"
        style={{ background: "linear-gradient(to right, var(--bg), transparent)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32"
        style={{ background: "linear-gradient(to left, var(--bg), transparent)" }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-center gap-5 mt-4">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous project"
          className="glass btn-hover w-10 h-10 rounded-[10px] flex items-center justify-center text-dim"
        >
          <ChevronIcon className="w-4 h-4 rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          {items.map((p, i) => (
            <button
              key={p.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${p.title}`}
              aria-current={i === activeDot}
              className="rounded-[10px] transition-all duration-300 hover:brightness-125 hover:scale-110"
              style={{
                width: i === activeDot ? "22px" : "7px",
                height: "7px",
                background: i === activeDot ? "var(--accent)" : "var(--line)",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next project"
          className="glass btn-hover w-10 h-10 rounded-[10px] flex items-center justify-center text-dim"
        >
          <ChevronIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Plain, motion-free horizontal row for prefers-reduced-motion - native
// scroll, no 3D/blur/parallax, mirroring the reduced-motion fallback
// pattern already used for the Skills rail.
function FlatRow({ items }) {
  return (
    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-6 scrollbar-hide">
      {items.map((p) => (
        <ProjectCard key={p.title} p={p} className="snap-start glass-hover" />
      ))}
    </div>
  );
}

export default function ProjectCarousel({ items }) {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? <FlatRow items={items} /> : <DepthCarousel items={items} />;
}
