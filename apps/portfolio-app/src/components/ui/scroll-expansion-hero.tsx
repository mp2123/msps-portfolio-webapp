'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { HeroParticleField } from '@/components/ui/hero-particle-field';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  eyebrow?: string;
  title?: string;
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
  subtitle,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isMobileState, setIsMobileState] = useState(false);
  const heroTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncProgress = () => {
      if (!heroTrackRef.current) return;

      const rect = heroTrackRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const scrollableDistance = Math.max(rect.height - viewportHeight, 1);
      const rawProgress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);

      setScrollProgress(rawProgress);
      setShowContent(rawProgress >= 0.56);
    };

    syncProgress();
    window.addEventListener('scroll', syncProgress, { passive: true });
    window.addEventListener('resize', syncProgress);

    return () => {
      window.removeEventListener('scroll', syncProgress);
      window.removeEventListener('resize', syncProgress);
    };
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const frameScale = 0.68 + scrollProgress * (isMobileState ? 0.46 : 0.76);
  const frameHeight = 360 + scrollProgress * (isMobileState ? 200 : 280);
  const frameTranslateY = 56 - scrollProgress * 120;
  const frameRotateX = 16 - scrollProgress * 16;
  const frameRotateY = -11 + scrollProgress * 11;
  const textTranslateX = scrollProgress * (isMobileState ? 92 : 62);
  const headingShiftY = scrollProgress * 52;
  const backgroundOpacity = 0.94 - scrollProgress * 0.42;
  const backgroundScale = 1.08 - scrollProgress * 0.14;
  const mediaShadow = `0 42px 120px rgba(14, 165, 233, ${0.14 + scrollProgress * 0.14}), 0 10px 60px rgba(2, 6, 23, 0.62)`;

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div className="overflow-x-hidden">
      <section ref={heroTrackRef} className="relative h-[185svh] md:h-[205svh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: backgroundOpacity, scale: backgroundScale }}
            transition={{ duration: 0.18 }}
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
            <HeroParticleField className="opacity-90" />
            <div className="absolute -left-20 top-[14%] h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl md:h-[24rem] md:w-[24rem]" />
            <div className="absolute right-[-8%] top-[12%] h-72 w-72 rounded-full bg-blue-500/16 blur-3xl md:h-[28rem] md:w-[28rem]" />
            <div className="absolute bottom-[10%] left-1/2 h-40 w-[72vw] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_0,transparent_1px)] bg-[size:100%_28px] opacity-[0.14]" />
            <motion.div
              className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent shadow-[0_0_30px_rgba(34,211,238,0.35)]"
                animate={{ opacity: [0.25, 0.8, 0.25], scaleX: [0.82, 1.02, 0.82] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_42%)]"
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="relative z-10 flex h-full items-center justify-center px-4">
            <div className="container mx-auto flex h-full max-w-7xl flex-col items-center justify-center">
              <div
                className={`pointer-events-none relative z-20 mb-8 flex w-full max-w-5xl flex-col items-center justify-center gap-4 text-center ${
                  textBlend ? 'mix-blend-difference' : 'mix-blend-normal'
                }`}
                style={{ transform: `translateY(-${headingShiftY}px)` }}
              >
                {eyebrow ? (
                  <motion.p
                    className="rounded-full border border-cyan-200/20 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.45em] text-cyan-100/80 shadow-[0_0_30px_rgba(34,211,238,0.08)] backdrop-blur-xl md:text-xs"
                    style={{ opacity: 1 - scrollProgress * 0.25 }}
                  >
                    {eyebrow}
                  </motion.p>
                ) : null}

                <div className="space-y-2">
                  <motion.h2
                    className="text-4xl font-bold text-blue-100 md:text-6xl lg:text-7xl"
                    style={{ transform: `translateX(-${textTranslateX}px)` }}
                  >
                    {firstWord}
                  </motion.h2>
                  <motion.h2
                    className="text-4xl font-bold text-cyan-100 md:text-6xl lg:text-7xl"
                    style={{ transform: `translateX(${textTranslateX}px)` }}
                  >
                    {restOfTitle}
                  </motion.h2>
                </div>

                {subtitle ? (
                  <motion.p
                    className="mx-auto max-w-3xl px-4 text-sm leading-relaxed text-blue-100/85 md:text-base lg:text-lg"
                    style={{ opacity: Math.max(0.36, 1 - scrollProgress * 0.42) }}
                  >
                    {subtitle}
                  </motion.p>
                ) : null}
              </div>

              <div className="relative flex w-full items-center justify-center [perspective:1800px]">
                <motion.div
                  className="absolute inset-x-0 top-[58%] mx-auto h-28 w-[78%] rounded-full bg-cyan-300/12 blur-3xl md:h-32"
                  animate={{ opacity: 0.36 + scrollProgress * 0.28, scaleX: 0.88 + scrollProgress * 0.24 }}
                />

                <div
                  className="relative z-20 w-full max-w-[1320px]"
                  style={{
                    height: `${frameHeight}px`,
                    maxHeight: '84vh',
                    transform: `translate3d(0, ${frameTranslateY}px, 0) rotateX(${frameRotateX}deg) rotateY(${frameRotateY}deg) scale(${frameScale})`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 120ms linear, height 120ms linear',
                  }}
                >
                  <div
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
                        animate={{ y: ['-10%', '420%'] }}
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
                            <motion.div
                              className="absolute inset-0 bg-black/35"
                              initial={{ opacity: 0.68 }}
                              animate={{ opacity: 0.48 - scrollProgress * 0.18 }}
                              transition={{ duration: 0.2 }}
                            />
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
                            <motion.div
                              className="absolute inset-0 bg-black/30"
                              initial={{ opacity: 0.68 }}
                              animate={{ opacity: 0.44 - scrollProgress * 0.14 }}
                              transition={{ duration: 0.2 }}
                            />
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
                          <motion.div
                            className="absolute inset-0 bg-black/45"
                            initial={{ opacity: 0.72 }}
                            animate={{ opacity: 0.6 - scrollProgress * 0.18 }}
                            transition={{ duration: 0.2 }}
                          />
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        className="relative z-10 flex w-full flex-col px-4 py-10 md:px-10 lg:px-16 lg:py-16"
        initial={{ opacity: 0, y: 48 }}
        animate={{
          opacity: showContent ? 1 : 0.24,
          y: showContent ? 0 : 48,
        }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.section>
    </div>
  );
};

export default ScrollExpandMedia;
