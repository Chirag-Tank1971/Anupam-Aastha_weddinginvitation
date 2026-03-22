"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { motion } from "framer-motion";
import IntroOverlay from "@/components/intro/IntroOverlay";
import Hero from "@/components/sections/Hero";
import CountdownScratch from "@/components/sections/CountdownScratch";
import WeddingCountdown from "@/components/sections/WeddingCountdown";
import Couple from "@/components/sections/Couple";
import Events from "@/components/sections/Events";
import Location from "@/components/sections/Location";
import RSVP from "@/components/sections/RSVP";
import FAQ from "@/components/sections/FAQ";
import CursorGlow from "@/components/ui/CursorGlow";
import MusicToggle from "@/components/ui/MusicToggle";
import Particles from "@/components/ui/Particles";
import StickyNav from "@/components/ui/StickyNav";
import MobileStickyNav from "@/components/ui/MobileStickyNav";
import GallerySkeleton from "@/components/ui/GallerySkeleton";
import SectionReveal from "@/components/ui/SectionReveal";

const Gallery = lazy(() => import("@/components/sections/Gallery"));

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleOpen = async () => {
    setIsRevealing(true);
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.45;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (!showIntro) {
      const timer = window.setTimeout(() => setIsRevealing(false), 1200);
      return () => window.clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <main className="relative bg-background text-foreground">
      <audio ref={audioRef} src="/audio/wedding-theme.mp3" preload="metadata" loop />
      <CursorGlow />
      <Particles />
      <MusicToggle audioRef={audioRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <StickyNav />
      <MobileStickyNav />
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{
          opacity: showIntro ? 0.88 : 1,
          scale: isRevealing ? 1.02 : 1,
        }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <Hero />
        <CountdownScratch />
        <WeddingCountdown />
        <SectionReveal>
          <Couple />
        </SectionReveal>
        <SectionReveal>
          <Events />
        </SectionReveal>
        <Suspense fallback={<GallerySkeleton />}>
          <Gallery />
        </Suspense>
        <RSVP />
        <Location />
        <FAQ />
      </motion.div>
      {showIntro && <IntroOverlay onOpen={handleOpen} onRevealComplete={() => setShowIntro(false)} />}
    </main>
  );
}
