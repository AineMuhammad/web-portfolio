"use client";

import { useMemo } from "react";
import * as THREE from "three";

// GLB imports arrive at whatever real-world scale/pivot they were exported
// with. This normalizes any model to a known max dimension, centers it
// horizontally, and rests its bottom on y=0 ("on the floor") rather than
// centering it vertically, so scene cameras/lights can be authored without
// knowing the source file's units in advance.
//
// `animations`, if passed, are evaluated to their final (clamped) frame on a
// disposable clone before measuring. Baked "assemble" animations (see
// SofaScene) ship with their rest pose set to the *scattered* starting
// layout, since the timeline needs somewhere to animate from - measuring
// that pose instead of the settled one pivots the model around the exploded
// parts rather than the shape it actually assembles into.
export function useCenteredModel(object3d, targetSize = 3, animations) {
  return useMemo(() => {
    const box = computeBoundingBox(object3d, animations);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;
    return {
      scale,
      position: [-center.x * scale, -box.min.y * scale, -center.z * scale],
    };
  }, [object3d, targetSize, animations]);
}

function computeBoundingBox(object3d, animations) {
  if (!animations || animations.length === 0) {
    return new THREE.Box3().setFromObject(object3d);
  }

  // Evaluate on a throwaway clone/mixer so this never touches the live
  // scene graph or the mixer that actually drives the on-scroll animation.
  const clone = object3d.clone(true);
  const mixer = new THREE.AnimationMixer(clone);
  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.play();
    action.paused = true;
    action.time = clip.duration;
  });
  mixer.update(0);
  const box = new THREE.Box3().setFromObject(clone);
  mixer.stopAllAction();
  mixer.uncacheRoot(clone);
  return box;
}
