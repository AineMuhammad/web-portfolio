"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    setTheme(next);
  }

  if (!theme) return <div className="w-16 h-8" />;

  return (
    <button
      onClick={toggle}
      aria-label="Toggle color theme"
      className="btn-hover flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-sm text-dim hover:text-[var(--text)] hover:bg-[color-mix(in_srgb,var(--text)_6%,transparent)] transition-colors"
    >
      <span
        className="w-1.5 h-1.5 rounded-[10px]"
        style={{ background: "var(--accent)" }}
      />
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
