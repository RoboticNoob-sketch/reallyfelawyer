"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";

// The SVG is potrace-traced from the source mark at its native raster size
// (459x544), so extrude/bevel parameters below are tuned in that same
// coordinate space — then the whole geometry is scaled down at the end
// (bevel math gets numerically unstable at very small absolute sizes, so
// it's easier to work big and scale down last).
const SCALE = 1 / 210;
const EXTRUDE_DEPTH = 46;
const BEVEL_THICKNESS = 10;
const BEVEL_SIZE = 8;

function useMarkGeometry() {
  const [geometry, setGeometry] = useState<THREE.ExtrudeGeometry | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/brand/taylor-mark.svg")
      .then((res) => res.text())
      .then((svgText) => {
        if (cancelled) return;
        const loader = new SVGLoader();
        const { paths } = loader.parse(svgText);
        // three-stdlib's parsed-path userData type is looser than the
        // createShapes signature expects; the shapes are what we actually
        // need out of it.
        const shapes = paths.flatMap((p) => SVGLoader.createShapes(p as Parameters<typeof SVGLoader.createShapes>[0]));
        const geo = new THREE.ExtrudeGeometry(shapes, {
          depth: EXTRUDE_DEPTH,
          bevelEnabled: true,
          bevelThickness: BEVEL_THICKNESS,
          bevelSize: BEVEL_SIZE,
          bevelSegments: 4,
          curveSegments: 12,
        });
        // SVG space is Y-down; three's Shape/Extrude space is Y-up, so flip
        // Y while also applying the final size scale in the same step.
        geo.center();
        geo.scale(SCALE, -SCALE, SCALE);
        geo.computeVertexNormals();
        setGeometry(geo);
      })
      .catch(() => {
        // Decorative — if it fails to load, the section still stands on its
        // copy alone.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return geometry;
}

function Seal({ geometry }: { geometry: THREE.ExtrudeGeometry }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetTilt = useRef({ x: 0, z: 0 });

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += delta * 0.35;

    const { pointer } = state;
    targetTilt.current.x = -pointer.y * 0.22;
    targetTilt.current.z = pointer.x * 0.16;
    group.rotation.x += (targetTilt.current.x - group.rotation.x) * Math.min(1, delta * 3);
    group.rotation.z += (targetTilt.current.z - group.rotation.z) * Math.min(1, delta * 3);
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial color="#E4B84A" metalness={0.9} roughness={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene() {
  const geometry = useMarkGeometry();
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      camera={{ fov: 32, position: [0, 0.3, 5.2] }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.12} />
      {/* Faint sky-to-ground tint — just enough that the metal doesn't go
          pure black in shadow, without washing out the contrast. */}
      <hemisphereLight args={["#FFF3D6", "#0A0600", 0.25]} />
      {/* Warm key light — the main gold highlight sweep. Strong and narrow
          so it reads as a sharp bright pass against a dark base as the
          piece turns, instead of an even overall glow. */}
      <directionalLight position={[3, 4, 3]} intensity={3.6} color="#FFEBB8" castShadow />
      {/* Faint cool fill so the shadow side isn't pure black, but stays dark. */}
      <pointLight position={[-4, -1.5, 2]} intensity={16} color="#CFE0FF" />
      {/* Rim light from behind to trace the edges as it turns. */}
      <pointLight position={[0, 2, -4]} intensity={55} color="#F3DA8C" />
      {geometry && <Seal geometry={geometry} />}
      <ContactShadows position={[0, -1.22, 0]} opacity={1} scale={5} blur={1.6} far={1.4} resolution={512} color="#000000" />
    </Canvas>
  );
}

export default function BrandSealScene() {
  return <Scene />;
}
