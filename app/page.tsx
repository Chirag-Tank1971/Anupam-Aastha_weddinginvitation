 "use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, easeInOut, motion, useScroll, useSpring, useTransform } from "framer-motion";

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const timelineEvents = [
  {
    time: "1 May 2026",
    title: "Mehendi & High Tea",
    note: "An intimate evening of colors, laughter, and music.",
    details: ["Timing - 4:00 PM onwards", "Dusit Gourmet"],
    focus: "center 10%",
    image: "/timeline/mehendi.jpeg",
    accent: "#b8860b",
  },
  {
    time: "1 May 2026",
    title: "Engagement Ceremony",
    note: "The beginning of forever with our loved ones.",
    details: ["Timing - 7:00 PM onwards", "Hotel Taj Theog"],
    // Adjust focal point so the couple's hands and faces are nicely visible on desktop
    focus: "center 25%",
    image: "/timeline/engagement.jpeg",
    accent: "#daa520",
  },
  {
    time: "2 May 2026",
    title: "Haldi ceremony",
    note: "A joyful yellow celebration of love and blessings.",
    details: ["Tilak - 11:00 AM", "Haldi - 2:30 PM", "Amphitheater, Dusit"],
    focus: "center 35%",
    image: "/timeline/haldi.jpeg",
    accent: "#8b4789",
  },
  {
    time: "2 May 2026",
    title: "Sangeet Night",
    note: "Dance, music, and unforgettable moments with everyone.",
    details: ["Timing - 7:00 PM onwards", "The Terrace Lawn"],
    focus: "center 10%",
    image: "/timeline/sangeet.jpeg",
    accent: "#c9a15d",
  },
  {
    time: "3 May 2026",
    title: "Wedding Ceremony",
    note: "Sacred vows at sunset amidst the hills.",
    details: ["Sehra Bandi - 2:30 PM", "Baraat - 3:00 PM", "Hotel Taj Theog"],
    focus: "center 15%",
    image: "/timeline/wedding.jpeg",
    accent: "#a6702f",
  },
  {
    time: "4 May 2026",
    title: "Gala dinner",
    note: "A graceful evening to celebrate our new beginning.",
    details: ["Timing - 7:30 PM onwards", "Hyatt Centric Sector 17, Chandigarh"],
    focus: "center 20%",
    image: "/timeline/reception.jpeg",
    accent: "#7e4f7d",
  },
];

type LocationKey = "wedding" | "stay" | "gala";

// Countdown to the main wedding day (3 May 2026)
const targetDate = new Date("2026-05-03T18:00:00+05:30");

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeInOut },
  },
};

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.18,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const heroHearts = [
  { left: "8%", delay: "0s", duration: "10.5s", size: "10px" },
  { left: "19%", delay: "1.3s", duration: "12.2s", size: "12px" },
  { left: "31%", delay: "0.7s", duration: "11.4s", size: "9px" },
  { left: "44%", delay: "2.1s", duration: "13.6s", size: "11px" },
  { left: "57%", delay: "0.4s", duration: "10.8s", size: "10px" },
  { left: "68%", delay: "1.8s", duration: "12.8s", size: "8px" },
  { left: "79%", delay: "0.9s", duration: "11.7s", size: "12px" },
  { left: "90%", delay: "2.4s", duration: "13.2s", size: "10px" },
];

const SCRATCH_WIDTH = 260;
const SCRATCH_HEIGHT = 280;
const SCRATCH_THRESHOLD = 0.6; // 60% scratched = auto complete
const SCRATCH_BRUSH_SIZE = 32;
const THRESHOLD_CHECK_INTERVAL_MS = 280;

function ScratchIntroCard({
  onComplete,
  isClosing,
}: {
  onComplete: () => void;
  isClosing: boolean;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const completedRef = useRef(false);
  const thresholdCheckRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleReveal = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsRevealed(true);
    if (thresholdCheckRef.current) {
      clearTimeout(thresholdCheckRef.current);
      thresholdCheckRef.current = null;
    }
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  // Draw premium gold + glitter + whitish base layer once
  const drawBase = useRef(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(SCRATCH_WIDTH * dpr);
    const h = Math.round(SCRATCH_HEIGHT * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Premium gold gradient (rich gold → lighter gold → whitish-gold highlight)
    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, "#b8860b");
    goldGrad.addColorStop(0.35, "#d4af37");
    goldGrad.addColorStop(0.6, "#e8d4a8");
    goldGrad.addColorStop(0.85, "#f5ecd2");
    goldGrad.addColorStop(1, "#fff8e7");
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, w, h);

    // Soft radial highlight (whitish center glow)
    const radialGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, w * 0.6);
    radialGrad.addColorStop(0, "rgba(255, 252, 245, 0.4)");
    radialGrad.addColorStop(0.5, "rgba(255, 248, 235, 0.15)");
    radialGrad.addColorStop(1, "transparent");
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, w, h);

    // Glitter layer 1: pearlescent white dots (denser)
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#fff";
    const step1 = 9;
    for (let y = 0; y < h; y += step1) {
      for (let x = 0; x < w; x += step1) {
        const jitter = (x + y) % 4;
        const r = 0.6 + (jitter * 0.3);
        ctx.beginPath();
        ctx.arc(x + (jitter - 2) * 1.5, y + ((jitter % 3) - 1) * 1.5, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Glitter layer 2: bright white sparkles (finer, more sparkle)
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#fff";
    const step2 = 6;
    for (let y = 0; y < h; y += step2) {
      for (let x = 0; x < w; x += step2) {
        if ((x + y) % 5 === 0) continue;
        const j = (x ^ y) % 3;
        ctx.beginPath();
        ctx.arc(x + j - 1, y + (j % 2), 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  });

  const getScratchedRatio = () => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let transparent = 0;
      const total = (data.length / 4) | 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 128) transparent++;
      }
      return total > 0 ? transparent / total : 0;
    } catch {
      return 0;
    }
  };

  const scheduleThresholdCheck = () => {
    if (thresholdCheckRef.current) return;
    thresholdCheckRef.current = setTimeout(() => {
      thresholdCheckRef.current = null;
      if (completedRef.current) return;
      if (getScratchedRatio() >= SCRATCH_THRESHOLD) {
        handleReveal();
      }
    }, THRESHOLD_CHECK_INTERVAL_MS);
  };

  const getCanvasPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const drawStroke = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const brush = SCRATCH_BRUSH_SIZE * dpr;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = brush;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = brush * 0.4;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (isRevealed || completedRef.current) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const point = getCanvasPoint(e.clientX, e.clientY);
    if (!point) return;
    isDrawingRef.current = true;
    lastPosRef.current = point;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current || !lastPosRef.current || isRevealed) return;
    e.preventDefault();
    const point = getCanvasPoint(e.clientX, e.clientY);
    if (!point) return;
    drawStroke(lastPosRef.current, point);
    lastPosRef.current = point;
    scheduleThresholdCheck();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    isDrawingRef.current = false;
    lastPosRef.current = null;
    scheduleThresholdCheck();
  };

  const onPointerLeave = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
    scheduleThresholdCheck();
  };

  useEffect(() => {
    drawBase.current();
  }, []);

  return (
    <motion.div
      className="mobile-intro-card mobile-intro-card--scratch"
      initial={{ scale: 1.05, y: 20, opacity: 0, rotate: -1 }}
      animate={
        isClosing
          ? { scale: 1.02, y: -20, opacity: 0, rotate: 0 }
          : { scale: 1, y: 0, opacity: 1, rotate: 0 }
      }
      transition={{ duration: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <motion.p
        className="scratch-intro-hint"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeInOut, delay: 0.25 }}
      >
        Scratch to reveal
      </motion.p>
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id="scratch-heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5 0.92 C0.25 0.65 0 0.42 0 0.26 C0 0.08 0.14 0 0.5 0.22 C0.86 0 1 0.08 1 0.26 C1 0.42 0.75 0.65 0.5 0.92 Z" />
          </clipPath>
        </defs>
      </svg>
      <div
        className="scratch-container scratch-container--heart"
        style={{ width: SCRATCH_WIDTH, height: SCRATCH_HEIGHT, touchAction: "none" }}
      >
        <div className="scratch-reveal" aria-hidden="true">
          <img
            src="/ganesh.png"
            alt=""
            className="scratch-ganesh-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="scratch-save-the-date">Save the date</span>
          <span className="scratch-date">3 May 2026</span>
        </div>

        <motion.div
          className="scratch-canvas-wrap"
          initial={{ opacity: 1 }}
          animate={isRevealed ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ pointerEvents: isRevealed ? "none" : "auto" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
          onPointerCancel={onPointerUp}
        >
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            width={SCRATCH_WIDTH}
            height={SCRATCH_HEIGHT}
            style={{ width: SCRATCH_WIDTH, height: SCRATCH_HEIGHT }}
            aria-hidden
          />
        </motion.div>
      </div>

      <motion.div
        className="scratch-names-wrap"
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={
          isRevealed
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0, y: 6, scale: 0.98 }
        }
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <div className="scratch-place">Anupam &amp; Aastha</div>
        {isRevealed && (
          <div className="scratch-reveal-dots" aria-hidden="true">
            <span className="scratch-reveal-dot" />
            <span className="scratch-reveal-dot" />
            <span className="scratch-reveal-dot" />
          </div>
        )}
      </motion.div>

      <motion.div
        className="scratch-cta-wrap"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeInOut, delay: 0.3 }}
      >
        <button
          type="button"
          className="mobile-intro-button"
          onClick={handleReveal}
          disabled={isRevealed}
        >
          {isRevealed ? "Proceeding..." : "Tap to reveal"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isIntroClosing, setIsIntroClosing] = useState(false);
  const [activeLocation, setActiveLocation] = useState<LocationKey>("wedding");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollY } = useScroll();
  const heroParallaxYRaw = useTransform(scrollY, [0, 900], [0, isMobile ? 72 : 140]);
  const heroParallaxScaleRaw = useTransform(scrollY, [0, 900], [isMobile ? 1.04 : 1.12, 1]);
  const heroOverlayOpacityRaw = useTransform(scrollY, [0, 900], [1, isMobile ? 0.88 : 0.82]);
  const heroParallaxY = useSpring(heroParallaxYRaw, { stiffness: 80, damping: 24, mass: 0.5 });
  const heroParallaxScale = useSpring(heroParallaxScaleRaw, { stiffness: 80, damping: 24, mass: 0.5 });
  const heroOverlayOpacity = useSpring(heroOverlayOpacityRaw, { stiffness: 90, damping: 26, mass: 0.45 });

  useEffect(() => {
    setMounted(true);
  }, []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {
          // ignore play errors
        });
    }
  };

  useEffect(() => {
    // Detect mobile viewport and only show the intro animation there
    const detectMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowIntro(false);
      }
    };

    detectMobile();
    window.addEventListener("resize", detectMobile);

    return () => window.removeEventListener("resize", detectMobile);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60),
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const pad = (v: number) => v.toString().padStart(2, "0");

      setTimeLeft({
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      {/* Background music (place your track as /public/music.mp3) */}
      <audio ref={audioRef} src="/music.mp3" loop />
      {/* MOBILE OPENING INTRO — heart-shaped scratch, Save the date + date */}
      <AnimatePresence>
        {isMobile && showIntro && (
          <motion.div
            className="mobile-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeInOut }}
          >
            <ScratchIntroCard
              isClosing={isIntroClosing}
              onComplete={() => {
                setIsIntroClosing(true);
                if (audioRef.current) {
                  audioRef.current
                    .play()
                    .then(() => setIsMusicPlaying(true))
                    .catch(() => {});
                }
                setTimeout(() => {
                  setShowIntro(false);
                  setIsIntroClosing(false);
                }, 750);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <header ref={heroRef} className="hero">
        <motion.div className="hero-parallax-layer" style={{ y: heroParallaxY, scale: heroParallaxScale }} />
        <motion.div
          className="hero-overlay-layer"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={showIntro ? { opacity: 0, scale: 1.08 } : { scale: 1 }}
          style={{ opacity: heroOverlayOpacity }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="hero-hearts" aria-hidden="true">
          {heroHearts.map((heart, idx) => (
            <span
              key={idx}
              className="hero-heart"
              style={
                {
                  "--heart-left": heart.left,
                  "--heart-delay": heart.delay,
                  "--heart-duration": heart.duration,
                  "--heart-size": heart.size,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <div className="container">
          <motion.div
            className="hero-inner"
            initial="hidden"
            animate={showIntro ? "hidden" : "visible"}
            variants={heroContainerVariants}
          >
            <motion.div className="hero-date" variants={heroItemVariants}>
              3 May 2026 • Shimla Hills
            </motion.div>
            <motion.div className="hero-names" variants={heroItemVariants}>
              <span className="hero-name">Anupam</span>
              <span className="hero-amp">&amp;</span>
              <span className="hero-name">Aastha</span>
            </motion.div>
            <div className="hero-place"></div>
            <motion.p className="hero-tagline" variants={heroItemVariants}>
            With the blessings of our families,
          we warmly invite you to a celebration woven with tradition and music,
      and heartfelt moments amidst the enchanting hills of Himachal Pradesh.
            </motion.p>
            <motion.div
              className="hero-cta"
              variants={heroItemVariants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <motion.a
                href="#countdown"
                className="btn-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Discover the details
              </motion.a>
              <div className="hero-subtle">
                Join us as we begin our forever
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* INTRO */}
      <section className="intro">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="eyebrow">Dear family &amp; friends</div>
            <h2>Welcome to our wedding celebration</h2>
            <div className="divider" />
          </motion.div>
          <motion.p
            className="intro-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={1}
          >
            We look forward to welcoming you as we come together to celebrate
            these special moments. Your presence will make our celebrations
            truly memorable.
          </motion.p>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section id="countdown" className="countdown">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={0}
          >
            <div className="eyebrow">The event starts in</div>
            <h2>Countdown to 3 May 2026</h2>
            <div className="divider" />
          </motion.div>

          <motion.div
            className="countdown-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={1}
          >
            <div className="countdown-grid">
              <CountdownBox label="Days" value={timeLeft.days} />
              <CountdownBox label="Hours" value={timeLeft.hours} />
              <CountdownBox label="Minutes" value={timeLeft.minutes} />
              <CountdownBox label="Seconds" value={timeLeft.seconds} />
            </div>
            <p className="countdown-note">
              Mark your calendars - celebrations begin on 1 May 2026 and
              culminate with the wedding celebrations on 3 May 2026.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAMILY */}
      <section>
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={0}
          >
            <h2>Blessing of our families</h2>
            <div className="divider" />
          </motion.div>

          <motion.div
            className="two-column"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" },
              },
            }}
          >
            <div className="card family-card family-card--groom">
              <div className="tag">Groom&apos;s family</div>
              <h3>Mr. Anupam Rakshit</h3>
              <p>
                Grandson of{" "}
                <strong>
                  Late Smt. Shanti Devi &amp; Late Shri Keshav Chandra Srivastava
                </strong>
                .
              </p>
              <p>
                Son of <strong>Mr. Abhay Kumar Srivastava</strong> &amp;{" "}
                <strong>Mrs. Antara Srivastava</strong>.
              </p>
              <p>
                Chacha chachi -{" "}
                <strong>Mr. Vinay Kumar Srivastava</strong> &amp;{" "}
                <strong>Mrs. Neera Srivastava</strong>.
              </p>
            </div>

            <div className="card family-card family-card--bride">
              <div className="tag">Bride&apos;s family</div>
              <h3>Ms. Aastha Kapil</h3>
              <p>
                Daughter of <strong>Mr. Digvijay Kapil</strong> &amp;{" "}
                <strong>Mrs. Radhika Kapil</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EVENTS TIMELINE */}
      <section className="timeline">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={0}
          >
            <div className="eyebrow">Wedding celebrations</div>
            <h2>Event timeline</h2>
            <div className="divider" />
          </motion.div>

          <motion.div
            className="timeline-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {timelineEvents.map((event) => (
              <TimelineEventCard
                key={`${event.time}-${event.title}`}
                time={event.time}
                title={event.title}
                note={event.note}
                // pass optional details if present
                // @ts-ignore - events may or may not have details
                details={event.details}
                // @ts-ignore - optional per-event focus (object-position)
                focus={event.focus}
                image={event.image}
                accent={event.accent}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* DRESS CODE & LOCATION */}
      <section>
        <div className="container">
          <div className="two-column">
         
            <motion.div
              className="card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              custom={1}
            >
              <div className="tag">Locations</div>
              <h3>How to reach us</h3>

              <div className="map-toggle">
                <button
                  type="button"
                  className={
                    activeLocation === "wedding"
                      ? "map-toggle-btn map-toggle-btn-active"
                      : "map-toggle-btn"
                  }
                  onClick={() => setActiveLocation("wedding")}
                >
                  Wedding venue
                </button>
                <button
                  type="button"
                  className={
                    activeLocation === "stay"
                      ? "map-toggle-btn map-toggle-btn-active"
                      : "map-toggle-btn"
                  }
                  onClick={() => setActiveLocation("stay")}
                >
                  Stay & pre-wedding
                </button>
                <button
                  type="button"
                  className={
                    activeLocation === "gala"
                      ? "map-toggle-btn map-toggle-btn-active"
                      : "map-toggle-btn"
                  }
                  onClick={() => setActiveLocation("gala")}
                >
                  Gala dinner
                </button>
              </div>

              {activeLocation === "wedding" ? (
                <>
                  <div className="location-name">Hotel Taj Theog</div>
                  <div className="location-address">
                    Theog, Shimla
                  </div>
                  <a
                    className="muted-link"
                    href="https://maps.google.com/?q=Hotel+Taj+Theog+Shimla"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                  <div className="map-wrapper">
                    <iframe
                      src="https://www.google.com/maps?q=Hotel+Taj+Theog+Shimla&output=embed"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ width: "100%", height: "320px", border: 0 }}
                    />
                  </div>
                </>
              ) : activeLocation === "gala" ? (
                <>
                  <div className="location-name">Hyatt Centric Sector 17 Chandigarh</div>
                  <div className="location-address">
                    Sector 17, Chandigarh
                  </div>
                  <p className="location-note">
                    Gala dinner will be hosted at Hyatt Centric Sector 17 Chandigarh.
                  </p>
                  <a
                    className="muted-link"
                    href="https://www.google.com/maps/search/?api=1&query=Hyatt+Centric+Sector+17+Chandigarh"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                  <div className="map-wrapper">
                    <iframe
                      src="https://www.google.com/maps?q=Hyatt+Centric+Sector+17+Chandigarh&output=embed"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ width: "100%", height: "320px", border: 0 }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="location-name">Stay &amp; Pre-Wedding Venues</div>
                  <div className="location-address">
                    Hotel Dusit Fagu
                    <br />
                    Majhar Rd. Katheldi, Himachal Pradesh - 171201
                  </div>
                  <p className="location-note">
                    Pre-wedding celebrations include events at Hotel Dusit Fagu.
                  </p>
                  <a
                    className="muted-link"
                    href="https://www.google.com/maps/search/?api=1&query=Hotel+Dusit+Fagu+Shimla"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Google Maps
                  </a>
                  <div className="map-wrapper">
                    <iframe
                      src="https://www.google.com/maps?q=Hotel+Dusit+Fagu+Shimla&output=embed"
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      style={{ width: "100%", height: "320px", border: 0 }}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ORGANIZATIONAL / PLANNER */}
      {/* (Planner / FAQ sections intentionally omitted to avoid incorrect details) */}

      {/* Family compliments */}
      <section id="family-compliments" className="family-compliments-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2>With best compliments from</h2>
            <div className="divider" />
          </motion.div>
          <motion.div
            className="card family-compliments-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeInUp}
          >
            <div className="family-compliments-names">
              <p className="family-compliments-secondary">
                Amitabh, Krishn, Anjali, Aditi, Divya
              </p>
            </div>
            <p className="family-compliments-note">
              Your presence will make our celebrations complete. We hope to see you in Himachal Pradesh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Music toggle (bottom-right) — portaled to body so it stays above intro/overlays */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <button
            type="button"
            className="music-toggle"
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? "Mute background music" : "Play background music"}
          >
            <span className="music-toggle-icon" aria-hidden="true">
              {isMusicPlaying ? (
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 9v6h4l5 4V5L8 9H4z"
                    fill="currentColor"
                  />
                  <path
                    d="M16.5 8.11a4 4 0 0 1 0 7.78"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18.5 5.5a7 7 0 0 1 0 13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 9v6h4l5 4V5L8 9H4z"
                    fill="currentColor"
                  />
                  <path
                    d="M18 9l-3 3 3 3M21 9l-3 3 3 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </button>,
          document.body
        )}

      <footer>
      Looking forward to seeing you
      <br />
      Families of Anupam &amp; Aastha
      </footer>
    </div>
  );
}

function CountdownBox({ label, value }: { label: string; value: string }) {
  return (
    <motion.div className="count-box" variants={fadeInUp} custom={Math.random()}>
      <div className="count-value">{value}</div>
      <div className="count-label">{label}</div>
    </motion.div>
  );
}

const FALLBACK_TIMELINE_IMAGE = "/timeline/wedding.jpeg";
const timelineTextStagger = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};
const timelineTextItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

function TimelineEventCard({
  time,
  title,
  note,
  image,
  accent,
  details,
  focus,
}: {
  time: string;
  title: string;
  note?: string;
  image: string;
  accent: string;
  details?: string[];
  focus?: string;
}) {
  const [imgSrc, setImgSrc] = useState(image);
  const handleImageError = () => setImgSrc(FALLBACK_TIMELINE_IMAGE);

  return (
    <motion.div
      className="timeline-event-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ "--timeline-accent": accent } as React.CSSProperties}
    >
      <div className="timeline-event-card-image-wrap">
        <motion.img
          src={imgSrc}
          alt=""
          className="timeline-event-card-image"
          loading="lazy"
          onError={handleImageError}
          initial={{ y: 24, scale: 1.08 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={focus ? ({ objectPosition: focus } as React.CSSProperties) : undefined}
        />
        <motion.div
          className="timeline-event-card-overlay"
          initial={{ opacity: 0.95 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ "--timeline-accent": accent } as React.CSSProperties}
        />
        <motion.div
          className="timeline-event-card-content"
          variants={timelineTextStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.45 }}
        >
          <motion.div className="timeline-event-card-date" variants={timelineTextItem}>
            {time}
          </motion.div>
          <motion.h3 className="timeline-event-card-title" variants={timelineTextItem}>
            {title}
          </motion.h3>
          {note && (
            <motion.p className="timeline-event-card-note" variants={timelineTextItem}>
              {note}
            </motion.p>
          )}

          {details && details.length > 0 && (
            <motion.ul className="timeline-event-details" variants={timelineTextItem}>
              {details.map((d, i) => (
                <motion.li key={i} className="timeline-event-detail" variants={timelineTextItem}>
                  {d}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
