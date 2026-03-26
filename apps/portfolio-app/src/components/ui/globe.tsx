"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

function GlobeVisual() {
  const meshRef = useRef<any>();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="hsl(var(--primary))"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.8}
        />
      </Sphere>
    </mesh>
  );
}

export const InteractiveGlobe = () => {
  return (
    <div className="w-full h-full min-h-[300px] pointer-events-none">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <GlobeVisual />
      </Canvas>
    </div>
  );
};
