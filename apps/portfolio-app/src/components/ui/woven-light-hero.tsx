"use client";

import {
  memo,
  type RefObject,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";

import { cn } from "@/lib/utils";

type WovenLightHeroProps = {
  eyebrow?: string;
  titleLines: string[];
  subtitle?: string;
  actions?: ReactNode;
  footerHint?: ReactNode;
  className?: string;
};

const HERO_PALETTE = ["#8be5ff", "#4fd8ff", "#84ccff", "#87a7ff"];
const POINT_COUNT = 4600;

function buildWovenGeometry() {
  const positions = new Float32Array(POINT_COUNT * 3);
  const colors = new Float32Array(POINT_COUNT * 3);
  const torusKnot = new THREE.TorusKnotGeometry(1.55, 0.38, 420, 24);
  const sourcePositions = torusKnot.getAttribute("position");
  const colorPool = HERO_PALETTE.map((hex) => new THREE.Color(hex));

  for (let index = 0; index < POINT_COUNT; index += 1) {
    const vertexIndex = index % sourcePositions.count;
    const stride = index * 3;
    const jitter = 0.045 + ((index % 17) / 17) * 0.03;

    positions[stride] =
      sourcePositions.getX(vertexIndex) + (Math.random() - 0.5) * jitter;
    positions[stride + 1] =
      sourcePositions.getY(vertexIndex) + (Math.random() - 0.5) * jitter;
    positions[stride + 2] =
      sourcePositions.getZ(vertexIndex) + (Math.random() - 0.5) * jitter;

    const baseColor = colorPool[index % colorPool.length].clone();
    baseColor.offsetHSL((Math.random() - 0.5) * 0.03, 0.08, 0.04);
    colors[stride] = baseColor.r;
    colors[stride + 1] = baseColor.g;
    colors[stride + 2] = baseColor.b;
  }

  torusKnot.dispose();

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return geometry;
}

const WovenLightCanvas = memo(function WovenLightCanvas({
  hostRef,
}: {
  hostRef: RefObject<HTMLDivElement | null>;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mountElement = mountRef.current;
    const hostElement = hostRef.current;
    if (!mountElement || !hostElement || prefersReducedMotion) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    mountElement.appendChild(renderer.domElement);

    const geometry = buildWovenGeometry();
    const materialA = new THREE.PointsMaterial({
      size: 0.048,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const materialB = materialA.clone();
    materialB.size = 0.038;
    materialB.opacity = 0.42;
    const materialC = materialA.clone();
    materialC.size = 0.055;
    materialC.opacity = 0.2;

    const primaryCloud = new THREE.Points(geometry, materialA);
    const secondaryCloud = new THREE.Points(geometry.clone(), materialB);
    const tertiaryCloud = new THREE.Points(geometry.clone(), materialC);

    secondaryCloud.scale.setScalar(1.07);
    tertiaryCloud.scale.setScalar(1.14);

    scene.add(primaryCloud, secondaryCloud, tertiaryCloud);

    const ambientLight = new THREE.AmbientLight(0xbde8ff, 1.4);
    const pointLight = new THREE.PointLight(0x59d5ff, 2.6, 30, 1.25);
    pointLight.position.set(0, 1.4, 7.5);
    scene.add(ambientLight, pointLight);

    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerCurrent = new THREE.Vector2(0, 0);
    let frameId = 0;
    let isDocumentVisible = !document.hidden;
    let isIntersecting = true;
    let isAnimating = false;

    const updateSize = () => {
      const { width, height } = hostElement.getBoundingClientRect();
      if (!width || !height) {
        return;
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(hostElement);
    updateSize();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = Boolean(entry?.isIntersecting);
        if (isIntersecting && isDocumentVisible) {
          startAnimation();
          return;
        }

        stopAnimation();
      },
      { threshold: 0.08 }
    );
    intersectionObserver.observe(hostElement);

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible && isIntersecting) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = hostElement.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointerTarget.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    };

    const handlePointerLeave = () => {
      pointerTarget.set(0, 0);
    };

    hostElement.addEventListener("pointermove", handlePointerMove);
    hostElement.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const clock = new THREE.Clock();

    function renderFrame() {
      frameId = window.requestAnimationFrame(renderFrame);
      const elapsed = clock.getElapsedTime();

      pointerCurrent.lerp(pointerTarget, 0.06);

      primaryCloud.rotation.y = elapsed * 0.16 + pointerCurrent.x * 0.18;
      primaryCloud.rotation.x = pointerCurrent.y * 0.1;
      primaryCloud.rotation.z = elapsed * 0.035;

      secondaryCloud.rotation.y = -elapsed * 0.12 + pointerCurrent.x * 0.1;
      secondaryCloud.rotation.x = elapsed * 0.045 + pointerCurrent.y * 0.08;
      secondaryCloud.rotation.z = -elapsed * 0.026;

      tertiaryCloud.rotation.y = elapsed * 0.08 - pointerCurrent.x * 0.12;
      tertiaryCloud.rotation.x = -elapsed * 0.03 + pointerCurrent.y * 0.05;
      tertiaryCloud.rotation.z = elapsed * 0.02;

      const pulse = 1 + Math.sin(elapsed * 1.4) * 0.015;
      primaryCloud.scale.setScalar(pulse);
      secondaryCloud.scale.setScalar(1.07 + Math.cos(elapsed * 1.1) * 0.018);
      tertiaryCloud.scale.setScalar(1.14 + Math.sin(elapsed * 0.8) * 0.022);

      pointLight.position.x = pointerCurrent.x * 2.6;
      pointLight.position.y = 1.4 + pointerCurrent.y * 1.5;

      renderer.render(scene, camera);
    }

    function startAnimation() {
      if (isAnimating) {
        return;
      }

      isAnimating = true;
      clock.start();
      renderFrame();
    }

    function stopAnimation() {
      if (!isAnimating) {
        return;
      }

      isAnimating = false;
      clock.stop();
      window.cancelAnimationFrame(frameId);
    }

    startAnimation();

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hostElement.removeEventListener("pointermove", handlePointerMove);
      hostElement.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      mountElement.removeChild(renderer.domElement);
      geometry.dispose();
      secondaryCloud.geometry.dispose();
      tertiaryCloud.geometry.dispose();
      materialA.dispose();
      materialB.dispose();
      materialC.dispose();
      renderer.dispose();
    };
  }, [hostRef, prefersReducedMotion]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none" />;
});

export function WovenLightHero({
  eyebrow,
  titleLines,
  subtitle,
  actions,
  footerHint,
  className,
}: WovenLightHeroProps) {
  const heroRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      ref={heroRef}
      className={cn(
        "relative isolate overflow-hidden px-4 pb-20 pt-[calc(var(--portfolio-header-height)+2.75rem)] md:px-6 md:pb-24 md:pt-[calc(var(--portfolio-header-height)+4.5rem)] lg:px-8",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.12),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.82),rgba(2,6,23,0.94)_68%,rgba(2,6,23,0.98))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_1px)] bg-[size:100%_28px] opacity-[0.07]" />
      <div className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent shadow-[0_0_30px_rgba(34,211,238,0.18)]" />
      <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.2)]" />
      <WovenLightCanvas hostRef={heroRef} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-var(--portfolio-header-height)-5rem)] max-w-7xl items-center">
        <div className="max-w-4xl space-y-7">
          {eyebrow ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="inline-flex items-center rounded-full border border-cyan-300/18 bg-cyan-300/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/85 shadow-[0_0_32px_rgba(34,211,238,0.08)]"
            >
              {eyebrow}
            </motion.div>
          ) : null}

          <div className="space-y-2">
            {titleLines.map((line, index) => (
              <motion.h1
                key={line}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.65, 0.3, 0.9], delay: 0.14 + index * 0.08 }}
                className={cn(
                  "text-balance text-[clamp(2.8rem,7vw,6.35rem)] font-bold leading-[0.9] tracking-tight text-white",
                  index === titleLines.length - 1 ? "text-cyan-100" : "text-white"
                )}
              >
                {line}
              </motion.h1>
            ))}
          </div>

          {subtitle ? (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
              className="max-w-3xl text-pretty text-base leading-relaxed text-zinc-300 md:text-lg"
            >
              {subtitle}
            </motion.p>
          ) : null}

          {actions ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.48 }}
              className="flex flex-wrap gap-3"
            >
              {actions}
            </motion.div>
          ) : null}

          {footerHint ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.6 }}
              className="max-w-2xl"
            >
              {footerHint}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
