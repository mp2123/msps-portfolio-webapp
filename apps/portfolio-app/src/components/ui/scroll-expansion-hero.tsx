'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

import { HeroParticleField } from '@/components/ui/hero-particle-field';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  eyebrow?: string;
  title?: string;
  titleLines?: string[];
  subtitle?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  eyebrow,
  title,
  titleLines,
  subtitle,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [isMobileState, setIsMobileState] = useState(false);
  const heroTrackRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, prefersReducedMotion
    ? { stiffness: 520, damping: 90 }
    : { stiffness: 180, damping: 28, mass: 0.24 });

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let frameId: number | null = null;

    const updateProgress = () => {
      const track = heroTrackRef.current;
      if (!track) {
        rawProgress.set(0);
        return;
      }

      const rect = track.getBoundingClientRect();
      const scrollRange = Math.max(rect.height - window.innerHeight, 1);
      const nextProgress = Math.max(0, Math.min(1, -rect.top / scrollRange));

      rawProgress.set(nextProgress);
    };

    const onScrollOrResize = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateProgress();
      });
    };

    updateProgress();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [rawProgress]);

  const showParticleField = !prefersReducedMotion && !isMobileState;
  const showAmbientMotion = !prefersReducedMotion && !isMobileState;
  const heroTrackHeight = isMobileState
    ? 'clamp(1420px, 176svh, 1880px)'
    : 'clamp(1660px, 156svh, 2100px)';
  const frameHeight = isMobileState ? 360 : 520;
  const firstLine = titleLines?.[0] ?? title ?? '';
  const secondLine = titleLines?.[1] ?? '';

  const backgroundOpacity = useTransform(progress, [0, 1], [0.98, 0.62]);
  const backgroundScale = useTransform(progress, [0, 1], [1.04, 0.95]);
  const eyebrowOpacity = useTransform(progress, [0, 1], [1, 0.78]);
  const headingTranslateY = useTransform(progress, [0, 1], [0, -12]);
  const leftTitleX = useTransform(progress, [0, 1], [0, isMobileState ? -42 : -30]);
  const rightTitleX = useTransform(progress, [0, 1], [0, isMobileState ? 42 : 30]);
  const subtitleOpacity = useTransform(progress, [0, 1], [1, 0.84]);
  const shellGlowOpacity = useTransform(progress, [0, 1], [0.28, 0.42]);
  const shellGlowScaleX = useTransform(progress, [0, 1], [0.9, 1.12]);
  const frameScale = useTransform(progress, [0, 0.93, 1], [
    isMobileState ? 0.78 : 0.72,
    isMobileState ? 1.01 : 1.06,
    isMobileState ? 1.06 : 1.12,
  ]);
  const frameTranslateY = useTransform(progress, [0, 0.93, 1], [64, 38, 20]);
  const frameRotateX = useTransform(progress, [0, 0.9, 1], [16, 2, 0]);
  const frameRotateY = useTransform(progress, [0, 0.9, 1], [-11, -1.5, 0]);
  const mediaOverlayOpacity = useTransform(progress, [0, 1], [0.56, 0.34]);
  const contentOpacity = useTransform(progress, [0, 0.56, 0.78, 1], [0, 0.06, 0.84, 1]);
  const shadowCyan = useTransform(progress, [0, 1], [0.18, 0.3]);
  const shadowSlate = useTransform(progress, [0, 1], [0.58, 0.68]);
  const mediaShadow = useMotionTemplate`0 42px 120px rgba(14, 165, 233, ${shadowCyan}), 0 10px 60px rgba(2, 6, 23, ${shadowSlate})`;

  return (
    <div className="overflow-x-hidden">
      <section ref={heroTrackRef} className="relative" style={{ height: heroTrackHeight }}>
        <div
          className="sticky overflow-hidden"
          style={{
            top: 'var(--portfolio-header-height)',
            height: 'calc(100svh - var(--portfolio-header-height))',
          }}
        >
          <motion.div
            className="absolute inset-0 z-0"
            style={{ opacity: backgroundOpacity, scale: backgroundScale }}
          >
            <Image
              src={bgImageSrc}
              alt="Background"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_78%_24%,rgba(59,130,246,0.18),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.68)_58%,rgba(2,6,23,0.95))]" />
          </motion.div>

          <div className="absolute inset-0 z-[1]">
            {showParticleField ? <HeroParticleField className="opacity-90" /> : null}
            <div className="absolute -left-20 top-[14%] h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl md:h-[24rem] md:w-[24rem]" />
            <div className="absolute right-[-8%] top-[12%] h-72 w-72 rounded-full bg-blue-500/16 blur-3xl md:h-[28rem] md:w-[28rem]" />
            <div className="absolute bottom-[10%] left-1/2 h-40 w-[72vw] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_0,transparent_1px)] bg-[size:100%_28px] opacity-[0.14]" />
            <div className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.22)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_42%)]" />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center px-4">
            <div className="container mx-auto flex h-full max-w-7xl flex-col items-center justify-start px-0 pb-8 pt-8 md:pb-10 md:pt-12 lg:pb-12 lg:pt-16 xl:justify-center xl:pt-0">
              <motion.div
                className={`pointer-events-none relative z-20 mb-8 flex w-full max-w-5xl flex-col items-center justify-center gap-4 px-1 text-center md:mb-10 ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
                style={{ y: headingTranslateY }}
              >
                {eyebrow ? (
                  <motion.p
                    className="max-w-[calc(100vw-2rem)] rounded-full border border-cyan-200/20 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.38em] text-cyan-100/80 shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur-xl md:text-[11px] md:tracking-[0.45em]"
                    style={{ opacity: eyebrowOpacity }}
                  >
                    {eyebrow}
                  </motion.p>
                ) : null}

                <div className="space-y-2 md:space-y-3">
                  <motion.h2
                    className="text-[clamp(3.1rem,7vw,6.2rem)] font-bold leading-[0.92] text-blue-100"
                    style={{ x: leftTitleX }}
                  >
                    {firstLine}
                  </motion.h2>
                  {secondLine ? (
                    <motion.h2
                      className="text-[clamp(3.1rem,7vw,6.2rem)] font-bold leading-[0.92] text-cyan-100"
                      style={{ x: rightTitleX }}
                    >
                      {secondLine}
                    </motion.h2>
                  ) : null}
                </div>

                {subtitle ? (
                  <motion.p
                    className="mx-auto max-w-3xl px-2 text-sm leading-relaxed text-blue-100/85 md:px-4 md:text-base lg:text-lg"
                    style={{ opacity: subtitleOpacity }}
                  >
                    {subtitle}
                  </motion.p>
                ) : null}
              </motion.div>

              <div className="relative flex w-full items-center justify-center [perspective:1800px]">
                <motion.div
                  className="absolute inset-x-0 top-[58%] mx-auto h-28 w-[78%] rounded-full bg-cyan-300/12 blur-3xl md:h-32"
                  style={{ opacity: shellGlowOpacity, scaleX: shellGlowScaleX }}
                />

                <motion.div
                  className="relative z-20 w-full max-w-[1320px]"
                  style={{
                    height: `${frameHeight}px`,
                    maxHeight: '84vh',
                    transformStyle: 'preserve-3d',
                    y: frameTranslateY,
                    rotateX: frameRotateX,
                    rotateY: frameRotateY,
                    scale: frameScale,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-[2rem] border border-cyan-200/15 bg-white/[0.03] backdrop-blur-xl"
                    style={{ boxShadow: mediaShadow }}
                  />
                  <div className="absolute inset-[10px] overflow-hidden rounded-[1.65rem] border border-white/10 bg-slate-950/92">
                    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-950/75 px-4 py-3 backdrop-blur-xl">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                      </div>
                      {date ? (
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-cyan-100/75">
                          {date}
                        </div>
                      ) : null}
                    </div>

                    <div className="absolute inset-0 top-[57px]">
                      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_40%),linear-gradient(135deg,rgba(8,47,73,0.28),rgba(15,23,42,0.22),rgba(8,47,73,0.12))]" />
                      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_0,transparent_2px)] bg-[size:100%_34px] opacity-[0.14]" />
                      <motion.div
                        className="absolute inset-x-0 top-[18%] z-10 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent"
                        animate={showAmbientMotion ? { y: ['-10%', '420%'] } : undefined}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-slate-950 to-transparent" />

                      {mediaType === 'video' ? (
                        mediaSrc.includes('youtube.com') ? (
                          <div className="relative h-full w-full pointer-events-none">
                            <iframe
                              width="100%"
                              height="100%"
                              src={
                                mediaSrc.includes('embed')
                                  ? mediaSrc +
                                    (mediaSrc.includes('?') ? '&' : '?') +
                                      'autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1'
                                  : mediaSrc.replace('watch?v=', 'embed/') +
                                      '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=' +
                                        mediaSrc.split('v=')[1]
                              }
                              className="h-full w-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                            <motion.div className="absolute inset-0 bg-black/35" style={{ opacity: mediaOverlayOpacity }} />
                          </div>
                        ) : (
                          <div className="relative h-full w-full pointer-events-none">
                            <video
                              src={mediaSrc}
                              poster={posterSrc}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="auto"
                              className="h-full w-full object-cover"
                              controls={false}
                              disablePictureInPicture
                              disableRemotePlayback
                            />
                            <motion.div className="absolute inset-0 bg-black/30" style={{ opacity: mediaOverlayOpacity }} />
                          </div>
                        )
                      ) : (
                        <div className="relative h-full w-full">
                          <Image
                            src={mediaSrc}
                            alt={title || 'Media content'}
                            width={1280}
                            height={720}
                            className="h-full w-full object-cover"
                          />
                          <motion.div className="absolute inset-0 bg-black/45" style={{ opacity: mediaOverlayOpacity }} />
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-end justify-between gap-3 px-5 pb-5">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100/55">
                            Portfolio signal
                          </p>
                          <p className="max-w-md text-sm text-zinc-200/85 md:text-base">
                            Business intelligence, automation, and decision-ready reporting systems.
                          </p>
                        </div>
                        {scrollToExpand ? (
                          <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100/75 backdrop-blur-xl">
                            {scrollToExpand}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        className="relative z-10 -mt-[18vh] flex w-full flex-col px-4 py-10 md:-mt-[30vh] md:px-10 lg:-mt-[40vh] lg:px-16 lg:py-16"
        style={{ opacity: contentOpacity }}
      >
        {children}
      </motion.section>
    </div>
  );
};

export default ScrollExpandMedia;
