"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";

type IntroOverlayProps = {
  onOpen: () => Promise<void> | void;
  onRevealComplete: () => void;
};

export default function IntroOverlay({ onOpen, onRevealComplete }: IntroOverlayProps) {
  const [isOpening, setIsOpening] = useState(false);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const centerGlowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleOpen = async () => {
    if (isOpening) return;
    setIsOpening(true);
    await onOpen();

    const tl = gsap.timeline({ onComplete: onRevealComplete });
    tl.to(centerGlowRef.current, { opacity: 1, scale: 1.1, duration: 0.45, ease: "power2.out" });

    if (prefersReducedMotion) {
      tl.to(
        [leftCurtainRef.current, rightCurtainRef.current],
        { opacity: 0, duration: 0.55, ease: "power2.inOut" },
        0.1
      ).to(centerGlowRef.current, { opacity: 0, duration: 0.35 }, 0.35);
      return;
    }

    tl.to(
      leftCurtainRef.current,
      {
        xPercent: -102,
        rotateY: 26,
        transformPerspective: 1200,
        transformOrigin: "left center",
        boxShadow: "30px 0 60px rgba(0,0,0,0.3)",
        duration: 1.35,
        ease: "power4.inOut",
        force3D: true,
      },
      0.12
    ).to(
      rightCurtainRef.current,
      {
        xPercent: 102,
        rotateY: -26,
        transformPerspective: 1200,
        transformOrigin: "right center",
        boxShadow: "-30px 0 60px rgba(0,0,0,0.3)",
        duration: 1.35,
        ease: "power4.inOut",
        force3D: true,
      },
      0.12
    );
    tl.to(centerGlowRef.current, { opacity: 0, duration: 0.5 }, 0.8);
  };

  return (
    <motion.section
      className="fixed inset-0 z-50 overflow-hidden [perspective:1200px]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div ref={centerGlowRef} className="pointer-events-none absolute inset-0 z-[2] scale-95 bg-[radial-gradient(circle,rgba(255,238,223,0.45),rgba(255,255,255,0))] opacity-0" />
      <div
        ref={leftCurtainRef}
        className="absolute top-0 left-0 z-[3] h-full w-1/2 bg-[linear-gradient(120deg,#5a0f1d_0%,#8d1d2f_40%,#721827_100%)] shadow-[inset_-15px_0_35px_rgba(255,255,255,0.07)] [transform-style:preserve-3d]"
      />
      <div
        ref={rightCurtainRef}
        className="absolute top-0 right-0 z-[3] h-full w-1/2 bg-[linear-gradient(240deg,#5a0f1d_0%,#8d1d2f_40%,#721827_100%)] shadow-[inset_15px_0_35px_rgba(255,255,255,0.07)] [transform-style:preserve-3d]"
      />

      <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center px-4 text-center md:px-6">
        <motion.p
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
          className="mb-5 max-w-[320px] text-[11px] uppercase leading-5 tracking-[0.3em] text-[#fde7e9] md:max-w-none md:text-sm md:tracking-[0.35em]"
        >
          {"Together with their families".split("").map((character, index) => (
            <motion.span
              key={`${character}-${index}`}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
            >
              {character}
            </motion.span>
          ))}
        </motion.p>

        <motion.h1
          className="font-heading text-[3.2rem] leading-[0.95] text-[#fff2f3] md:text-8xl"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1.1 }}
        >
          Anupam & Aastha
        </motion.h1>

        <motion.button
          onClick={handleOpen}
          disabled={isOpening}
          className="group relative mt-8 inline-flex items-center justify-center overflow-hidden rounded-full border border-white/55 px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-white md:mt-10 md:px-8 md:text-sm md:tracking-[0.22em]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Open Invitation</span>
          <span className="absolute inset-0 bg-white/10 transition-opacity duration-300 group-hover:opacity-80" />
          <motion.span
            className="absolute inset-0 rounded-full border border-white/50"
            initial={{ scale: 1, opacity: 0 }}
            whileTap={{ scale: 1.8, opacity: 0.35 }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>
      </div>
    </motion.section>
  );
}
