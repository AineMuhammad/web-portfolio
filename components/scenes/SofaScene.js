"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, PerspectiveCamera, ContactShadows, Environment } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useThemeColors } from "@/lib/useThemeColors";
import { useCenteredModel } from "@/lib/useCenteredModel";
import SceneLoader from "@/components/scenes/SceneLoader";

const PLAYBACK_SPEED = 2;
const FOV = 20;
const MIN_DISTANCE = 3.5;
const MAX_DISTANCE = 13.5;

// sofa.glb ships with 3 baked clips (the chair body/frame + two pillows)
// that assemble together as one sequence, at 2x speed. `play` is set true
// once the section is scrolled into view (see SofaShowcase.js). `onFinished`
// fires once every clip has clamped at its final frame, so the camera only
// starts auto-rotating after the assembly has fully come together - not
// while pieces are still flying into place.
function SofaModel({ play, onFinished }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/GLB/sofa.glb");
  const { actions, mixer } = useAnimations(animations, group);
  const { scale, position } = useCenteredModel(scene, 3, animations);
  const reducedMotion = useReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    if (!play || started.current) return;
    started.current = true;

    const clips = Object.values(actions).filter(Boolean);
    if (clips.length === 0) {
      onFinished?.();
      return;
    }

    if (reducedMotion) {
      clips.forEach((action) => {
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.time = action.getClip().duration;
        action.paused = true;
        action.play();
      });
      onFinished?.();
      return;
    }

    let remaining = clips.length;
    const handleFinished = () => {
      remaining -= 1;
      if (remaining === 0) {
        mixer.removeEventListener("finished", handleFinished);
        onFinished?.();
      }
    };
    mixer.addEventListener("finished", handleFinished);

    clips.forEach((action) => {
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.timeScale = PLAYBACK_SPEED;
      action.play();
    });
  }, [play, actions, mixer, reducedMotion, onFinished]);

  return (
    <group ref={group} scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  );
}

// Positioned at exactly MAX_DISTANCE from the OrbitControls target, along
// the originally-authored viewing angle, so the scene opens fully zoomed
// out and the user zooms in from there (rather than starting near
// MIN_DISTANCE). See useCenteredModel: it normalizes the model so its
// assembled (not scattered-rest-pose) bounding box maxDim == targetSize,
// which is what MIN_DISTANCE/MAX_DISTANCE below are actually calibrated
// against.
const CAMERA_POSITION = [7.37, 5.71, 10.28];

export default function SofaScene({ play }) {
  const { accent } = useThemeColors();
  const [animationDone, setAnimationDone] = useState(false);

  return (
    <div className="relative w-full h-full">
      <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
        {/* High focal length (narrow FOV) for a compressed, telephoto look
            on the product shot. */}
        <PerspectiveCamera makeDefault position={CAMERA_POSITION} fov={FOV} />
        {/* Dramatic studio rig instead of a flat three-point setup: ambient
            is pushed way down so shadows go genuinely dark, the key is hot
            and directional so fabric folds carve out real contrast, a
            narrow top-down spot adds a hard-edged pool of light across the
            cushions, and the rim is pushed hard and cool to slice the
            silhouette off the background. The accent point light is the
            only "soft" source, there purely to kiss the shadow side with
            brand color rather than fill it. */}
        <ambientLight intensity={0.05} />
        <directionalLight position={[4, 6, 4]} intensity={3.6} color="#fff2e0" />
        <directionalLight position={[-5, 2, -4]} intensity={0.16} />
        <directionalLight position={[-3, 3, -5]} intensity={2.4} color="#8fb8ff" />
        <spotLight
          position={[1.5, 8, 2]}
          angle={0.35}
          penumbra={0.6}
          intensity={4.5}
          distance={16}
          decay={2}
          color="#ffffff"
        />
        <pointLight position={[-4, 1, 2]} color={accent} intensity={1.8} distance={9} />
        <Suspense fallback={null}>
          {/* Image-based lighting so PBR materials pick up real reflections
              instead of flat direct-light-only shading. Not shown as a
              background - reflections only. Kept low so the direct rig
              above (not ambient reflections) is what drives the contrast.
              Environment suspends while its HDR loads, so it must live
              under this boundary (Canvas mounts its own reconciler root -
              an outer/page-level Suspense can't catch it). */}
          <Environment preset="apartment" environmentIntensity={0.22} />
          <SofaModel play={play} onFinished={() => setAnimationDone(true)} />
          <ContactShadows position={[0, 0.001, 0]} opacity={0.7} scale={6} blur={1.3} far={2} />
        </Suspense>
        <OrbitControls
          target={[0, 1, 0]}
          enableDamping
          enablePan
          autoRotate={animationDone}
          autoRotateSpeed={1.2}
          minDistance={MIN_DISTANCE}
          maxDistance={MAX_DISTANCE}
          // Never dip below eye level, so the underside is never visible.
          maxPolarAngle={Math.PI * 0.48}
        />
      </Canvas>
      <SceneLoader />
    </div>
  );
}

useGLTF.preload("/GLB/sofa.glb");
