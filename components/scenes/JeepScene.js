"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, PerspectiveCamera, ContactShadows, Environment } from "@react-three/drei";
import { useThemeColors } from "@/lib/useThemeColors";
import { useCenteredModel } from "@/lib/useCenteredModel";
import { PAINT_COLORS } from "@/lib/jeepPaintColors";
import SceneLoader from "@/components/scenes/SceneLoader";
import PaintSwatches from "@/components/scenes/PaintSwatches";

const BODY_MATERIAL_NAME = "00 - BODY";
const FOV = 20;
const MIN_DISTANCE = 5.2;
const MAX_DISTANCE = 15.6;

const CAMERA_POSITION = [5.89, 1.99, 0.52];

function JeepModel({ colorHex }) {
  const { scene, materials } = useGLTF("/GLB/jeep_2021.glb");

  // useGLTF's `scene`/`materials` are a shared, module-level cache keyed by
  // URL, so mutating them directly (an earlier version of this component
  // did) risks the mesh ending up pointing at a stale material clone across
  // dev double-renders. Cloning the whole scene once per instance keeps
  // this component's repaint fully independent of that cache.
  const { clonedScene, bodyMaterial } = useMemo(() => {
    const clonedScene = scene.clone(true);
    const original = materials[BODY_MATERIAL_NAME];
    const bodyMaterial = original ? original.clone() : null;
    if (bodyMaterial) {
      clonedScene.traverse((obj) => {
        if (obj.isMesh && obj.material && obj.material.name === BODY_MATERIAL_NAME) {
          obj.material = bodyMaterial;
        }
      });
    }
    return { clonedScene, bodyMaterial };
  }, [scene, materials]);

  const { scale, position } = useCenteredModel(clonedScene);

  useEffect(() => {
    bodyMaterial?.color.set(colorHex);
  }, [bodyMaterial, colorHex]);

  return (
    <group scale={scale} position={position}>
      <primitive object={clonedScene} />
    </group>
  );
}

export default function JeepScene() {
  const [colorIndex, setColorIndex] = useState(0);
  const { accent } = useThemeColors();

  return (
    <div className="flex flex-col">
      <div className="relative w-full h-[65vh] md:h-[85vh]">
        <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
          {/* High focal length (narrow FOV) for a compressed, telephoto
              look on the product shot. */}
          <PerspectiveCamera makeDefault position={CAMERA_POSITION} fov={FOV} />
          {/* Three-point rig: one dominant key so the body panels actually
              model, a soft fill to keep shadows from going pure black, and a
              cool rim behind/opposite the key to separate the silhouette
              from the background. Ambient is kept low - it's a flat,
              direction-less fill that reads as "flat lighting" if it does
              too much work. */}
          <ambientLight intensity={0.18} />
          <directionalLight position={[4, 6, 4]} intensity={2} />
          <directionalLight position={[-5, 2, -4]} intensity={0.3} />
          <directionalLight position={[-3, 3, -5]} intensity={0.9} color="#dbe9ff" />
          <pointLight position={[0, 1.5, -3]} color={accent} intensity={0.8} />
          <Suspense fallback={null}>
            {/* Image-based lighting so the painted body and glass pick up
                real reflections instead of flat direct-light-only shading.
                Not shown as a background - reflections only. Environment
                suspends while its HDR loads, so it must live under this
                boundary (Canvas mounts its own reconciler root - an
                outer/page-level Suspense can't catch it). */}
            <Environment preset="city" environmentIntensity={0.6} />
            <JeepModel colorHex={PAINT_COLORS[colorIndex].hex} />
            <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={7} blur={2} far={2.5} />
          </Suspense>
          <OrbitControls
            target={[0, 0.62, 0]}
            enablePan={false}
            enableDamping
            autoRotate
            autoRotateSpeed={1.2}
            minDistance={MIN_DISTANCE}
            maxDistance={MAX_DISTANCE}
            // Never dip below eye level, so the underside is never visible.
            maxPolarAngle={Math.PI * 0.48}
          />
        </Canvas>
        <SceneLoader />
      </div>
      <PaintSwatches colorIndex={colorIndex} onSelect={setColorIndex} />
    </div>
  );
}

useGLTF.preload("/GLB/jeep_2021.glb");
