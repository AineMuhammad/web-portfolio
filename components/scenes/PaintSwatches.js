"use client";

import { PAINT_COLORS } from "@/lib/jeepPaintColors";

// Shared between JeepScene (interactive) and Projects.js's loading
// placeholders, so the swatch row occupies identical space in both loading
// and loaded states - otherwise the page height jumps once the jeep
// configurator's JS/GLB finish loading in.
export default function PaintSwatches({ colorIndex = 0, onSelect, disabled = false }) {
  return (
    <div className="w-full px-4 md:px-8 flex flex-wrap items-center gap-4 pt-5 pb-5">
      <p className="text-xs font-medium tracking-[0.14em] uppercase text-dim mr-1">Paint</p>
      {PAINT_COLORS.map((c, i) => (
        <button
          key={c.hex}
          type="button"
          aria-label={c.name}
          title={c.name}
          aria-pressed={i === colorIndex}
          disabled={disabled}
          onClick={() => onSelect?.(i)}
          className="w-11 h-11 rounded-[10px] border-2 hairline transition-all duration-200 hover:brightness-110 cursor-pointer disabled:cursor-default disabled:hover:brightness-100"
          style={{
            background: disabled ? "transparent" : c.hex,
            boxShadow: disabled ? "none" : "0 2px 6px rgba(0,0,0,0.25)",
            outline: !disabled && i === colorIndex ? "3px solid var(--accent)" : "none",
            outlineOffset: 3,
            transform: !disabled && i === colorIndex ? "scale(1.12)" : "scale(1)",
            opacity: disabled ? 0.35 : 1,
          }}
        />
      ))}
    </div>
  );
}
