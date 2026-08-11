"use client";

import { useProgress } from "@react-three/drei";

// Overlays a progress readout on top of a Canvas while any R3F loader
// (useGLTF, textures, etc.) is active. Sits as an absolutely-positioned
// sibling of the Canvas inside a `relative` wrapper.
export default function SceneLoader() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ background: "var(--surface-2)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className="w-7 h-7 rounded-[10px] border-2 animate-spin"
          style={{ borderColor: "var(--line)", borderTopColor: "var(--accent)" }}
        />
        <p className="text-sm text-dim">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
