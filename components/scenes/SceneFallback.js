"use client";

export default function SceneFallback({ label = "Loading 3D scene…" }) {
  return (
    <div className="w-full h-full min-h-[220px] flex items-center justify-center">
      <p className="text-sm text-dim animate-pulse">{label}</p>
    </div>
  );
}
