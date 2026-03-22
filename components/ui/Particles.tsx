"use client";

import { useReducedMotion } from "framer-motion";

export default function Particles() {
  const reduced = useReducedMotion();
  const particles = Array.from({ length: 20 });

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((_, index) => (
        <span
          key={index}
          className="sparkle absolute block rounded-full bg-[#b23a48]"
          style={{
            width: `${2 + (index % 4)}px`,
            height: `${2 + (index % 4)}px`,
            left: `${(index * 7) % 100}%`,
            top: `${(index * 13) % 100}%`,
            animationDelay: `${index * 0.35}s`,
            opacity: 0.12,
          }}
        />
      ))}
    </div>
  );
}
