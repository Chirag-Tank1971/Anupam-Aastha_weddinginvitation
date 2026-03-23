"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { playRevealChime } from "@/lib/playRevealChime";
import { buildWeddingIcs, downloadIcs, WHATSAPP_SHARE_TEXT } from "@/lib/calendar";

const CELEBRATION_MS = 2600;

const DATE_PARTS = [
  { key: "day" as const, label: "Day", value: "3" },
  { key: "month" as const, label: "Month", value: "May" },
  { key: "year" as const, label: "Year", value: "2026" },
];

type CellKey = (typeof DATE_PARTS)[number]["key"];

function drawGoldenScratchLayer(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  canvas.width = rect.width;
  canvas.height = rect.height;
  context.globalCompositeOperation = "source-over";

  const gradient = context.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#e8c547");
  gradient.addColorStop(0.45, "#c9a962");
  gradient.addColorStop(1, "#6b4f2a");
  context.fillStyle = gradient;
  context.fillRect(0, 0, rect.width, rect.height);

  context.fillStyle = "rgba(255,255,255,0.22)";
  for (let i = 0; i < 90; i += 1) {
    context.fillRect((i * 37) % rect.width, (i * 31) % rect.height, 1, 1);
  }
}

function GoldenScratchCell({
  cellKey,
  label,
  value,
  revealed,
  onReveal,
}: {
  cellKey: CellKey;
  label: string;
  value: string;
  revealed: boolean;
  onReveal: (key: CellKey) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);
  const autoRevealRef = useRef(false);
  const [autoReveal, setAutoReveal] = useState(false);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawGoldenScratchLayer(canvas);
    const onResize = () => drawGoldenScratchLayer(canvas);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [revealed]);

  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scratch = (clientX: number, clientY: number) => {
      const context = canvas.getContext("2d");
      if (!context) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(x, y, 18, 0, Math.PI * 2);
      context.fill();
    };

    const revealProgressCheck = () => {
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context || autoRevealRef.current) return;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      let transparent = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] < 25) transparent += 1;
      }
      const percent = transparent / (imageData.data.length / 4);
      if (percent >= 0.14) {
        autoRevealRef.current = true;
        setAutoReveal(true);
        window.setTimeout(() => {
          onReveal(cellKey);
        }, 320);
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      scratching.current = true;
      scratch(event.clientX, event.clientY);
    };
    const onMouseMove = (event: MouseEvent) => {
      if (!scratching.current) return;
      scratch(event.clientX, event.clientY);
      revealProgressCheck();
    };
    const onMouseUp = () => {
      scratching.current = false;
      revealProgressCheck();
    };

    const onTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      scratching.current = true;
      const touch = event.touches[0];
      if (touch) scratch(touch.clientX, touch.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      if (!scratching.current) return;
      const touch = event.touches[0];
      if (touch) scratch(touch.clientX, touch.clientY);
      revealProgressCheck();
    };
    const onTouchEnd = () => {
      scratching.current = false;
      revealProgressCheck();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("touchcancel", onTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [revealed, onReveal, cellKey]);

  const valueClass =
    value.length <= 2
      ? "text-[1.65rem] leading-none sm:text-4xl"
      : value.length <= 4
        ? "text-base leading-tight sm:text-lg"
        : "text-xs leading-tight sm:text-sm";

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative h-[5.25rem] w-[5.25rem] shrink-0 overflow-hidden rounded-full border-2 border-[#c9a962]/75 bg-[#fffdf8] shadow-[0_8px_28px_rgba(107,79,42,0.2)] sm:h-28 sm:w-28 [overscroll-behavior:contain]"
        style={{ touchAction: "none" }}
      >
        <div className="flex h-full w-full items-center justify-center px-1.5">
          <span className={`font-heading text-[#111111] ${valueClass}`}>{value}</span>
        </div>

        <AnimatePresence>
          {!revealed && (
            <motion.canvas
              ref={canvasRef}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer select-none rounded-full"
              initial={{ opacity: 1 }}
              animate={{ opacity: autoReveal ? 0 : 1 }}
              exit={{ opacity: 0, transition: { duration: 0.45 } }}
              transition={{ duration: 0.4 }}
              aria-hidden
            />
          )}
        </AnimatePresence>

        {!revealed && (
          <p className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-1 text-center text-[0.45rem] font-semibold uppercase leading-tight tracking-[0.12em] text-[#fffef8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:text-[0.5rem]">
            Scratch
          </p>
        )}
      </div>
      <p className="mt-2.5 text-center text-[0.65rem] uppercase tracking-[0.22em] text-[#b23a48]">{label}</p>
    </div>
  );
}

export default function CountdownScratch() {
  const [cells, setCells] = useState<Record<CellKey, boolean>>({
    day: false,
    month: false,
    year: false,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const reducedMotion = useReducedMotion();
  const chimePlayed = useRef(false);

  const allRevealed = cells.day && cells.month && cells.year;

  const markRevealed = useCallback((key: CellKey) => {
    setCells((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  useEffect(() => {
    if (!allRevealed) {
      chimePlayed.current = false;
      return;
    }
    if (chimePlayed.current) return;
    chimePlayed.current = true;
    setShowCelebration(true);
    if (!reducedMotion) playRevealChime();
    const t = window.setTimeout(() => setShowCelebration(false), CELEBRATION_MS);
    return () => window.clearTimeout(t);
  }, [allRevealed, reducedMotion]);

  const handleSaveDate = () => {
    downloadIcs("anupam-aastha-wedding.ics", buildWeddingIcs());
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(WHATSAPP_SHARE_TEXT)}`;

  return (
    <section
      id="date"
      className="section-padding relative z-10 bg-white pt-10 [overscroll-behavior:contain]"
      style={{ touchAction: "manipulation" }}
    >
      <CelebrationOverlay active={showCelebration} reducedMotion={reducedMotion} />

      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#b23a48]">Wedding Date</p>

        <div className="relative mx-auto">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-[#c9a962]/35 bg-[#fffdf8] p-6 shadow-[0_25px_60px_rgba(17,17,17,0.08)] md:p-8"
            animate={
              allRevealed
                ? reducedMotion
                  ? { boxShadow: "0 25px 60px rgba(201,169,98,0.25)" }
                  : {
                      scale: [1, 1.02, 1.01, 1],
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
            {allRevealed && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_35%,rgba(232,213,183,0.55),rgba(255,255,255,0)_62%)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: reducedMotion ? 0.5 : [0, 1, 0.35, 0] }}
                transition={{ duration: reducedMotion ? 0.4 : 1.4 }}
              />
            )}

            <motion.div
              className="relative flex flex-row flex-wrap items-end justify-center gap-5 sm:gap-8"
              animate={allRevealed && !reducedMotion ? { y: [0, -2, 0] } : {}}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {DATE_PARTS.map((part) => (
                <GoldenScratchCell
                  key={part.key}
                  cellKey={part.key}
                  label={part.label}
                  value={part.value}
                  revealed={cells[part.key]}
                  onReveal={markRevealed}
                />
              ))}
            </motion.div>

            {allRevealed && (
              <motion.div
                className="relative mt-6"
                initial={{ opacity: 0, y: 6 }}
                animate={
                  reducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: 0, scale: [1, 1.03, 1] }
                }
                transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
              >
                <p className="font-heading text-2xl text-[#111111] md:text-3xl">3 May 2026</p>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#b23a48]">
                  Marriage at Sunset | 3:00 PM Baraat Move
                </p>
                <p className="font-heading mt-2 text-base text-[#444] md:text-lg">Hotel Taj Theog, Shimla</p>
              </motion.div>
            )}

            {allRevealed && (
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

          {!allRevealed && (
            <p className="mt-4 text-center text-sm text-[#555]">Scratch each golden circle to reveal the date</p>
          )}
        </div>
      </div>
    </section>
  );
}
