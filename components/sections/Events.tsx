"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useMemo, useRef } from "react";
import { events, type WeddingEvent } from "@/lib/data";
import { useReducedMotion } from "@/lib/useReducedMotion";

const VIEWPORT = { once: true, amount: 0.3 } as const;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function EventCopyOverlay({
  date,
  title,
  time,
  venue,
  overlayClassName,
  overlayContentClassName,
  reducedMotion,
}: {
  date: string;
  title: string;
  time: string;
  venue: string;
  overlayClassName: string;
  overlayContentClassName?: string;
  reducedMotion: boolean;
}) {
  const { containerVariants, itemVariants } = useMemo(() => {
    const container: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reducedMotion ? 0 : 0.1,
          delayChildren: reducedMotion ? 0 : 0.22,
        },
      },
    };

    const item: Variants = {
      hidden: {
        opacity: reducedMotion ? 1 : 0,
        y: reducedMotion ? 0 : 16,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reducedMotion ? 0.2 : 0.55,
          ease: EASE,
        },
      },
    };

    return { containerVariants: container, itemVariants: item };
  }, [reducedMotion]);

  const alignClass = overlayContentClassName ?? "items-center text-center";

  return (
    <motion.div
      className={`pointer-events-none absolute flex flex-col px-3 ${alignClass} ${overlayClassName}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <motion.p
        variants={itemVariants}
        className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-[#6b5b52] sm:text-[0.65rem]"
      >
        {date}
      </motion.p>
      <motion.h3
        variants={itemVariants}
        className="font-heading mt-2 max-w-[18ch] text-xl leading-snug text-[#111111] sm:mt-3 sm:max-w-[22ch] sm:text-2xl md:text-[1.65rem]"
      >
        {title}
      </motion.h3>
      <motion.p
        variants={itemVariants}
        className="mt-3 max-w-[28ch] text-[0.8rem] leading-relaxed text-[#3a3a3a] sm:mt-4 sm:max-w-md sm:text-sm"
      >
        {time}
      </motion.p>
      <motion.p
        variants={itemVariants}
        className="mt-3 max-w-[32ch] text-[0.62rem] font-semibold uppercase leading-snug tracking-[0.14em] text-[#b23a48] sm:mt-4 sm:text-[0.68rem] sm:tracking-[0.16em]"
      >
        {venue}
      </motion.p>
    </motion.div>
  );
}

function EventSlide({ event }: { event: WeddingEvent }) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [10, -10]);

  const slideExtra = event.slideClassName ?? "bg-[#faf8f5]";
  const imageExtra = event.imageClassName?.trim() ?? "";

  return (
    <motion.article
      ref={ref}
      className={`relative h-[100svh] w-full overflow-hidden md:h-[100dvh] ${slideExtra}`}
    >
      <motion.div
        className="absolute inset-0 h-full w-full will-change-transform"
        style={{ y: reducedMotion ? 0 : parallaxY }}
      >
        <motion.div
          className="relative h-full w-full origin-center"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
          whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 0.95 }}
          viewport={VIEWPORT}
          transition={{
            duration: reducedMotion ? 0.25 : 0.9,
            ease: EASE,
          }}
        >
          <Image
            key={event.image}
            src={event.image}
            alt={event.title}
            fill
            sizes="100vw"
            className={["object-cover object-center", imageExtra].filter(Boolean).join(" ")}
            priority={false}
          />
        </motion.div>
      </motion.div>
      <EventCopyOverlay
        date={event.date}
        title={event.title}
        time={event.time}
        venue={event.venue}
        overlayClassName={event.overlayClassName}
        overlayContentClassName={event.overlayContentClassName}
        reducedMotion={reducedMotion}
      />
    </motion.article>
  );
}

export default function Events() {
  return (
    <section id="events" className="relative z-10 overflow-x-hidden bg-white">
      <div className="section-padding pb-10">
        <h2 className="font-heading text-center text-5xl text-[#111111]">Wedding Events</h2>
      </div>

      <div className="flex w-full flex-col">
        {events.map((event) => (
          <EventSlide key={event.title} event={event} />
        ))}
      </div>
    </section>
  );
}
