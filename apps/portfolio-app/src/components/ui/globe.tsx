"use client";

import { useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Mesh } from "three";

type PointerState = {
  x: number;
  y: number;
};

function GlobeVisual({
  hovered,
  pointerRef,
}: {
  hovered: boolean;
  pointerRef: MutableRefObject<PointerState>;
}) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    if (!mesh || !material) return;

    const targetY = state.clock.getElapsedTime() * 0.18 + pointerRef.current.x * 0.8;
    const targetX = pointerRef.current.y * 0.45;

    mesh.rotation.y += (targetY - mesh.rotation.y) * Math.min(0.16, delta * 8);
    mesh.rotation.x += (targetX - mesh.rotation.x) * Math.min(0.14, delta * 7);
    mesh.rotation.z += ((hovered ? 0.18 : 0.08) - mesh.rotation.z) * Math.min(0.08, delta * 4);

    material.distort += ((hovered ? 0.52 : 0.34) - material.distort) * Math.min(0.18, delta * 6);
    material.speed += ((hovered ? 2.1 : 1.35) - material.speed) * Math.min(0.18, delta * 6);
  });

  return (
    <mesh ref={meshRef} scale={hovered ? 1.05 : 0.96}>
      <Sphere args={[1.5, 96, 96]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#55e4ff"
          emissive="#12d7ff"
          emissiveIntensity={hovered ? 0.9 : 0.55}
          attach="material"
          distort={0.34}
          speed={1.35}
          roughness={0.25}
          metalness={0.1}
        />
      </Sphere>
    </mesh>
  );
}

export const InteractiveGlobe = () => {
  const [hovered, setHovered] = useState(false);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0 });
  const cameraPosition = useMemo(() => [0, 0, 4.9] as const, []);

  return (
    <div
      className="h-full min-h-[180px] w-full cursor-grab active:cursor-grabbing"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerRef.current = {
          x: ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2,
          y: ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2,
        };
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        pointerRef.current = { x: 0, y: 0 };
      }}
    >
      <Canvas camera={{ position: cameraPosition, fov: 36 }}>
        <ambientLight intensity={0.55} />
        <pointLight position={[2.5, 2.5, 3]} intensity={hovered ? 18 : 11} color="#67e8f9" />
        <directionalLight position={[-3, 2, 4]} intensity={0.9} color="#dbeafe" />
        <GlobeVisual hovered={hovered} pointerRef={pointerRef} />
      </Canvas>
    </div>
  );
};
