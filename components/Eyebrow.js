// Small label-with-dot used above section headings across the site,
// replacing the old uppercase-mono ".tag" treatment which read as HUD/menu
// chrome rather than editorial copy.
export default function Eyebrow({ children, className = "" }) {
  return (
    <p className={`inline-flex items-center gap-2 text-sm text-dim ${className}`}>
      <span className="w-1.5 h-1.5 rounded-[10px] shrink-0" style={{ background: "var(--accent)" }} />
      {children}
    </p>
  );
}
