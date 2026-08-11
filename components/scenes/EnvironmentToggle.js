"use client";

export default function EnvironmentToggle({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className="btn-hover absolute top-4 right-4 z-10 glass flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-medium tracking-[0.1em] uppercase text-dim hover:text-[var(--text)] transition-colors"
    >
      <span
        className="w-1.5 h-1.5 rounded-[10px]"
        style={{ background: active ? "var(--accent)" : "var(--text-dim)" }}
      />
      Backdrop
    </button>
  );
}
