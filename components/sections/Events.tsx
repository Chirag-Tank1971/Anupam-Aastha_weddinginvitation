"use client";

import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { events, venueCard, type WeddingEvent } from "@/lib/data";
import { useLenis } from "@/lib/lenis-context";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Short clips (2–3s): seek whenever scroll target differs measurably from decoded time */
const SEEK_EPS = 0.0015;

type SlideMetrics = {
  progress: number;
  inView: boolean;
};

function getSlideMetrics(el: HTMLElement | null): SlideMetrics {
  if (!el) return { progress: 0, inView: false };
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const h = rect.height;
  if (h <= 0) return { progress: 0, inView: false };
  const p = (vh - rect.top) / (vh + h);
  const inView = rect.bottom > 0 && rect.top < vh;
  return { progress: Math.min(1, Math.max(0, p)), inView };
}

type EventSlideProps = {
  event: WeddingEvent;
  /** Flatten top radius for non-first cards so stacked seams are flush */
  mergeTop?: boolean;
  /** Flatten bottom radius so the next block (venue) sits flush — avoids a white seam from the section bg */
  mergeBottom?: boolean;
  /** Pull this card up by 1px to hide double borders between stacked cards */
  overlapTop?: boolean;
  /** Hide top border for non-first cards so no horizontal divider is visible */
  hideTopBorder?: boolean;
};

function EventSlide({
  event,
  mergeTop = false,
  mergeBottom = false,
  overlapTop = false,
  hideTopBorder = false,
}: EventSlideProps) {
  const lenis = useLenis();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const reducedMotion = useReducedMotion();
  const parallaxY = useMotionValue(0);
  const smoothedForParallaxRef = useRef(0);
  const hasSeededParallaxRef = useRef(false);
  const syncRef = useRef<() => void>(() => {});
  const hasPrimedVideoRef = useRef(false);

  const slideExtra = event.slideClassName ?? "bg-[#faf8f5]";
  const videoExtra = event.videoClassName?.trim() ?? "";

  const syncFromLayout = useCallback(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track) return;

    const { progress: pRaw, inView } = getSlideMetrics(track);

    if (!hasSeededParallaxRef.current) {
      smoothedForParallaxRef.current = pRaw;
      hasSeededParallaxRef.current = true;
    } else {
      smoothedForParallaxRef.current =
        smoothedForParallaxRef.current + (pRaw - smoothedForParallaxRef.current) * 0.22;
    }

    if (!reducedMotion) {
      parallaxY.set((smoothedForParallaxRef.current - 0.5) * 16);
    } else {
      parallaxY.set(0);
    }

    if (!video || !duration || !Number.isFinite(duration) || duration <= 0) {
      return;
    }

    if (reducedMotion) {
      if (!video.paused) video.pause();
      return;
    }

    if (!video.paused) {
      video.pause();
    }

    if (!inView) {
      return;
    }

    // iOS often reports metadata before enough frame data is decodable for visual seeking.
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

    const safeDur = Math.max(duration - 1e-3, 0);
    const target = Math.min(Math.max(pRaw * duration, 0), safeDur);
    const delta = Math.abs(video.currentTime - target);
    if (delta > SEEK_EPS) {
      try {
        video.currentTime = target;
      } catch {
        /* seek can fail if pipeline not ready; next frame retries */
      }
    }
  }, [duration, reducedMotion, parallaxY]);

  syncRef.current = syncFromLayout;

  useEffect(() => {
    if (!lenis) return;
    const onLenisScroll = () => syncRef.current();
    lenis.on("scroll", onLenisScroll);
    onLenisScroll();
    return () => {
      lenis.off("scroll", onLenisScroll);
    };
  }, [lenis]);

  useAnimationFrame(() => {
    // Always run frame sync so scrub behavior is consistent across native scroll and Lenis.
    syncRef.current();
  });

  useLayoutEffect(() => {
    syncRef.current();
  }, [duration]);

  useEffect(() => {
    const onResize = () => syncRef.current();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => syncRef.current();
    const onOrientationChange = () => syncRef.current();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("orientationchange", onOrientationChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, []);

  useEffect(() => {
    const primeOnFirstGesture = async () => {
      if (hasPrimedVideoRef.current) return;
      const v = videoRef.current;
      if (!v) return;
      hasPrimedVideoRef.current = true;
      try {
        await v.play();
      } catch {
        // Ignore; we'll still try to pause and continue with scroll-seek flow.
      } finally {
        v.pause();
        syncRef.current();
      }
    };

    window.addEventListener("touchstart", primeOnFirstGesture, { passive: true, once: true });
    window.addEventListener("pointerdown", primeOnFirstGesture, { passive: true, once: true });
    return () => {
      window.removeEventListener("touchstart", primeOnFirstGesture);
      window.removeEventListener("pointerdown", primeOnFirstGesture);
    };
  }, []);

  const applyDurationFromVideo = useCallback((v: HTMLVideoElement) => {
    const d = v.duration;
    if (Number.isFinite(d) && d > 0) setDuration(d);
  }, []);

  return (
    <div
      ref={trackRef}
      className={`relative h-[100svh] w-full shrink-0 md:h-[100dvh] ${overlapTop ? "-mt-px" : ""}`}
    >
      {/*
        No negative margins / sticky stack — those compressed the whole section into one viewport.
        One full-height track per slide; scroll reveals each card in order.
      */}
      <article
        className={`relative isolate h-full w-full overflow-hidden rounded-2xl border border-black/[0.06] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.14)] ${hideTopBorder ? "border-t-0" : ""} ${mergeTop ? "rounded-t-none" : ""} ${mergeBottom ? "rounded-b-none" : ""} ${slideExtra}`}
      >
        <motion.div
          className="absolute inset-0 h-full w-full will-change-transform"
          style={{ y: reducedMotion ? 0 : parallaxY }}
        >
          <div className="relative h-full w-full">
            <video
              key={event.videoSrc}
              ref={videoRef}
              src={event.videoSrc}
              muted
              playsInline
              preload="auto"
              className={["absolute inset-0 h-full w-full object-cover object-center", videoExtra]
                .filter(Boolean)
                .join(" ")}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                applyDurationFromVideo(v);
                v.pause();
                v.currentTime = 0;
              }}
              onDurationChange={(e) => applyDurationFromVideo(e.currentTarget)}
              onLoadedData={(e) => {
                const v = e.currentTarget;
                applyDurationFromVideo(v);
                v.pause();
                syncRef.current();
              }}
              aria-label={event.title}
            />
          </div>
        </motion.div>
      </article>
    </div>
  );
}

export function VenueCard() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative h-[82svh] w-full shrink-0 md:h-[90dvh]">
      <article
        id="venue-card"
        className="relative isolate h-full w-full overflow-hidden rounded-2xl border border-[#111]/8 bg-[#FCF9F7] shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)]"
        aria-label="Venue video"
      >
        {/* Full-viewport bleed (matches event slides); image covers entire area */}
        <div className="relative h-full w-full">
          <video
            src="/events/venue.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover object-center"
            aria-label="Venue preview video"
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,253,249,0.46)_0%,rgba(255,253,249,0.18)_42%,rgba(255,253,249,0.22)_100%)]" />
          <div className="absolute inset-0 z-[2] flex items-start justify-center px-6 pt-6 pb-10 text-center md:items-center md:px-10 md:py-14">
            <motion.div
              className="w-full max-w-lg -translate-y-8 rounded-xl bg-[rgba(252,249,247,0.72)] px-4 py-3 backdrop-blur-[1px] md:-translate-y-32 md:px-6 md:py-4"
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 90 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={
                reducedMotion ? { duration: 0 } : { delay: 0.35, duration: 1.9, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </div>
        </div>
      </article>
    </div>
  );
}

type EventsProps = {
  includeVenueCard?: boolean;
};

export default function Events({ includeVenueCard = true }: EventsProps) {
  return (
    <section id="events" className="relative z-10 overflow-x-hidden bg-white">
      <div className="section-padding pb-10">
        <h2 className="font-heading section-title text-center text-5xl text-[#111111]">Wedding Events</h2>
      </div>

      <div className="relative flex w-full flex-col gap-0">
        {events.map((event, index) => (
          <EventSlide
            key={event.title}
            event={event}
            mergeTop={index > 0}
            mergeBottom={index < events.length - 1}
            overlapTop={index > 0}
            hideTopBorder={index > 0}
          />
        ))}
        {includeVenueCard ? <VenueCard /> : null}
      </div>
    </section>
  );
}
