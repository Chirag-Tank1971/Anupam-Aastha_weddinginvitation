"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const handleMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [reduced]);

  if (reduced) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-40 hidden h-32 w-32 rounded-full bg-[#b23a48]/20 blur-3xl md:block"
      animate={{ x: position.x - 72, y: position.y - 72 }}
      transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.3 }}
    />
  );
}
