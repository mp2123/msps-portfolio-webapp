"use client";

import { useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Mesh } from "three";
import { useInView } from "framer-motion";

type PointerState = {
  x: number;
  y: number;
};

type DistortMaterialLike = {
  distort: number;
  speed: number;
};

const isDistortMaterial = (value: unknown): value is DistortMaterialLike =>
  Boolean(
    value &&
      typeof value === "object" &&
      "distort" in value &&
      typeof value.distort === "number" &&
      "speed" in value &&
      typeof value.speed === "number"
  );

function GlobeVisual({
  hovered,
  pointerRef,
}: {
  hovered: boolean;
  pointerRef: MutableRefObject<PointerState>;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !isDistortMaterial(mesh.material)) return;
    const material = mesh.material;

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
  const [pointerState, setPointerState] = useState<PointerState>({ x: 0, y: 0 });
  const cameraPosition = useMemo(() => [0, 0, 4.9] as const, []);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[180px] w-full cursor-grab active:cursor-grabbing"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const nextPointer = {
          x: ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2,
          y: ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2,
        };
        pointerRef.current = nextPointer;
        setPointerState(nextPointer);
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        pointerRef.current = { x: 0, y: 0 };
        setPointerState({ x: 0, y: 0 });
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at ${50 + pointerState.x * 12}% ${50 + pointerState.y * 10}%, rgba(85,228,255,${hovered ? 0.26 : 0.12}), rgba(8,15,26,0) 52%)`,
          filter: hovered ? "blur(8px)" : "blur(14px)",
          opacity: hovered ? 1 : 0.82,
          transform: `scale(${hovered ? 1.06 : 0.98})`,
          transition: "opacity 280ms ease, transform 280ms ease, filter 280ms ease",
        }}
      />
      <div className="pointer-events-none absolute inset-[18%] rounded-full border border-cyan-300/15 shadow-[0_0_42px_rgba(34,211,238,0.18)]" />
      <Canvas camera={{ position: cameraPosition, fov: 36 }} frameloop={isInView ? "always" : "never"}>
        <ambientLight intensity={0.55} />
        <pointLight position={[2.5, 2.5, 3]} intensity={hovered ? 18 : 11} color="#67e8f9" />
        <directionalLight position={[-3, 2, 4]} intensity={0.9} color="#dbeafe" />
        {isInView && <GlobeVisual hovered={hovered} pointerRef={pointerRef} />}
      </Canvas>
    </div>
  );
};
