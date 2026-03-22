"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type ParticlesProps = {
  /** When false (e.g. during intro), particles are not shown. */
  active?: boolean;
};

const COUNT = 26;
const ENTER_DELAY_MS = 320;

export default function Particles({ active = true }: ParticlesProps) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), ENTER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (reduced || !active || !visible) return null;

  const particles = Array.from({ length: COUNT });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[8] overflow-hidden"
      aria-hidden
    >
      {particles.map((_, index) => {
        const drift = (index % 9) * 9 - 36;
        const duration = 11 + (index % 11);
        const delay = index * 0.28;
        const size = 2 + (index % 4);
        const accent = index % 5 === 0 ? "#c9a962" : "#b23a48";

        return (
          <span
            key={index}
            className="sparkle-fall absolute block rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${(index * 17 + (index % 7) * 3) % 100}%`,
              top: "-3%",
              backgroundColor: accent,
              ["--sparkle-drift" as string]: `${drift}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
