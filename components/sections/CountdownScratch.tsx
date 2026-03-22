"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { playRevealChime } from "@/lib/playRevealChime";
import { buildWeddingIcs, downloadIcs, WHATSAPP_SHARE_TEXT } from "@/lib/calendar";

const CELEBRATION_MS = 2600;

export default function CountdownScratch() {
  const [revealed, setRevealed] = useState(false);
  const [autoReveal, setAutoReveal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      context.globalCompositeOperation = "source-over";
      const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#b23a48");
      gradient.addColorStop(1, "#8f2231");
      context.fillStyle = gradient;
      context.fillRect(0, 0, rect.width, rect.height);

      context.fillStyle = "rgba(255,255,255,0.18)";
      for (let i = 0; i < 80; i += 1) {
        context.fillRect((i * 39) % rect.width, (i * 29) % rect.height, 1, 1);
      }
    };

    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [revealed]);

  const revealProgressCheck = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 25) transparent += 1;
    }
    const percent = transparent / (imageData.data.length / 4);
    if (percent >= 0.14 && !autoReveal) {
      setAutoReveal(true);
      window.setTimeout(() => {
        setRevealed(true);
        setShowCelebration(true);
        if (!reducedMotion) playRevealChime();
        window.setTimeout(() => setShowCelebration(false), CELEBRATION_MS);
      }, 320);
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 24, 0, Math.PI * 2);
    context.fill();
  };

  const handleSaveDate = () => {
    downloadIcs("anupam-aastha-wedding.ics", buildWeddingIcs());
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(WHATSAPP_SHARE_TEXT)}`;

  return (
    <section id="date" className="section-padding relative z-10 bg-white pt-10">
      <CelebrationOverlay active={showCelebration} reducedMotion={reducedMotion} />

      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#b23a48]">Wedding Date</p>

        <div className="relative mx-auto max-w-3xl">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-[#b23a48]/20 bg-white/85 p-8 shadow-[0_25px_60px_rgba(17,17,17,0.08)] backdrop-blur-sm"
            animate={
              revealed
                ? reducedMotion
                  ? { boxShadow: "0 25px 60px rgba(201,169,98,0.25)" }
                  : {
                      scale: [1, 1.035, 1.01, 1],
                      boxShadow: [
                        "0 25px 60px rgba(17,17,17,0.08)",
                        "0 28px 70px rgba(201,169,98,0.35)",
                        "0 22px 55px rgba(178,58,72,0.2)",
                        "0 25px 60px rgba(17,17,17,0.08)",
                      ],
                    }
                : {}
            }
            transition={{ duration: reducedMotion ? 0.5 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {revealed && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_35%,rgba(232,213,183,0.55),rgba(255,255,255,0)_62%)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: reducedMotion ? 0.5 : [0, 1, 0.35, 0] }}
                transition={{ duration: reducedMotion ? 0.4 : 1.4 }}
              />
            )}

            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1400&q=80"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-20"
              />
            </div>

            <motion.div
              className="relative"
              animate={revealed && !reducedMotion ? { y: [0, -2, 0] } : {}}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.p
                className="font-heading text-4xl text-[#111111] md:text-5xl"
                animate={revealed && !reducedMotion ? { scale: [1, 1.04, 1] } : {}}
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
              >
                3 May 2026
              </motion.p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#b23a48]">Marriage at Sunset | 3:00 PM Baraat Move</p>
              <p className="mt-2 text-sm text-[#444]">Hotel Taj Theog, Shimla</p>
            </motion.div>

            {revealed && (
              <motion.div
                className="relative mt-6 flex flex-wrap items-center justify-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <button
                  type="button"
                  onClick={handleSaveDate}
                  className="rounded-full border border-[#c9a962] bg-[#fffdf8] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#8a7030] transition hover:bg-[#c9a962]/15"
                >
                  Save the date
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#b23a48]/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#b23a48] transition hover:bg-[#b23a48]/10"
                >
                  Share on WhatsApp
                </a>
              </motion.div>
            )}
          </motion.div>

          <AnimatePresence>
            {!revealed && (
              <motion.canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-3xl"
                initial={{ opacity: 1 }}
                animate={{ opacity: autoReveal ? 0 : 1 }}
                exit={{ opacity: 0, transition: { duration: 0.45 } }}
                transition={{ duration: 0.4 }}
                onMouseDown={(event) => {
                  scratching.current = true;
                  scratch(event.clientX, event.clientY);
                }}
                onMouseMove={(event) => {
                  if (!scratching.current) return;
                  scratch(event.clientX, event.clientY);
                  revealProgressCheck();
                }}
                onMouseUp={() => {
                  scratching.current = false;
                  revealProgressCheck();
                }}
                onMouseLeave={() => {
                  scratching.current = false;
                }}
                onTouchStart={(event) => {
                  scratching.current = true;
                  const touch = event.touches[0];
                  scratch(touch.clientX, touch.clientY);
                }}
                onTouchMove={(event) => {
                  if (!scratching.current) return;
                  const touch = event.touches[0];
                  scratch(touch.clientX, touch.clientY);
                  revealProgressCheck();
                }}
                onTouchEnd={() => {
                  scratching.current = false;
                  revealProgressCheck();
                }}
              />
            )}
          </AnimatePresence>

          {!revealed && (
            <p className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 text-center text-sm font-medium tracking-[0.2em] text-white">
              Scratch to Reveal Marriage Date
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
