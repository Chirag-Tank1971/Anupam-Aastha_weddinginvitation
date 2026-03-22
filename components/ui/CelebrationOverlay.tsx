"use client";

import { AnimatePresence, motion } from "framer-motion";

type CelebrationOverlayProps = {
  active: boolean;
  reducedMotion: boolean;
};

const GOLD = ["#c9a962", "#e8d5b7", "#d4af37", "#f5e6c8"];
const WINE = ["#b23a48", "#8f2231", "#d45666"];

export default function CelebrationOverlay({ active, reducedMotion }: CelebrationOverlayProps) {
  if (reducedMotion) {
    return (
      <AnimatePresence>
        {active && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[45] bg-[radial-gradient(circle_at_center,rgba(201,169,98,0.25),transparent_65%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[45] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55 } }}
        >
          {/* Soft champagne vignette */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(232,213,183,0.45),rgba(255,255,255,0)_55%)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />

          {/* Confetti — mixed gold + wine, varied sizes */}
          {Array.from({ length: 72 }).map((_, i) => {
            const isGold = i % 3 !== 0;
            const color = isGold ? GOLD[i % GOLD.length] : WINE[i % WINE.length];
            const w = 3 + (i % 5);
            const left = (i * 13.7) % 100;
            const delay = (i % 14) * 0.025;
            const duration = 1.35 + (i % 9) * 0.12;
            const drift = (i % 7) - 3;
            return (
              <motion.span
                key={`c-${i}`}
                className="absolute top-0 rounded-sm shadow-sm"
                style={{
                  width: w,
                  height: w * (i % 2 === 0 ? 1.4 : 0.7),
                  left: `${left}%`,
                  backgroundColor: color,
                  rotate: (i * 17) % 360,
                }}
                initial={{ y: -24, opacity: 0, x: 0 }}
                animate={{
                  y: "105vh",
                  x: drift * 18,
                  opacity: [0, 1, 1, 0.85, 0],
                  rotate: (i * 17) % 360 + 180,
                }}
                transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
              />
            );
          })}

          {/* Larger twinkling sparkles */}
          {Array.from({ length: 22 }).map((_, i) => (
            <motion.span
              key={`s-${i}`}
              className="absolute rounded-full"
              style={{
                width: 4 + (i % 4),
                height: 4 + (i % 4),
                left: `${(i * 19) % 100}%`,
                top: `${8 + (i % 5) * 6}%`,
                background: `linear-gradient(135deg, ${GOLD[i % GOLD.length]}, #fff)`,
                boxShadow: "0 0 12px rgba(232,213,183,0.9)",
              }}
              initial={{ opacity: 0, scale: 0.5, y: -10 }}
              animate={{
                opacity: [0, 1, 0.6, 1, 0],
                scale: [0.5, 1.2, 1, 1.15, 0.8],
                y: [0, 28, 12, 40, 60],
              }}
              transition={{
                duration: 1.8 + (i % 5) * 0.15,
                delay: 0.05 * (i % 10),
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
