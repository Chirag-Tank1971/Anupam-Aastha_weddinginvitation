"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type HeroProps = {
  videoActive?: boolean;
};

export default function Hero({ videoActive = true }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!videoActive) {
      video.pause();
      return;
    }
    video.play().catch(() => {
      // Ignore autoplay policy errors; user gesture is typically available after intro open.
    });
  }, [videoActive]);

  return (
    <section id="hero" ref={sectionRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ y: prefersReducedMotion ? 0 : backgroundY }}
        animate={prefersReducedMotion ? {} : { scale: [1, 1.03, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      >
        <video
          ref={videoRef}
          src="/events/hero.mp4"
          className="h-full w-full object-cover object-center"
          muted
          playsInline
          loop
          preload="auto"
          autoPlay={videoActive}
          aria-label="Wedding hero background"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),rgba(249,245,242,0.28)_58%,rgba(248,248,248,0.36))]" />
    </section>
  );
}
