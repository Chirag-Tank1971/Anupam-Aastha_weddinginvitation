"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { LenisProvider } from "@/lib/lenis-context";
import IntroOverlay from "@/components/intro/IntroOverlay";
import Hero from "@/components/sections/Hero";
import CountdownScratch from "@/components/sections/CountdownScratch";
import WeddingCountdown from "@/components/sections/WeddingCountdown";
import Couple from "@/components/sections/Couple";
import Events from "@/components/sections/Events";
import Location from "@/components/sections/Location";
import FAQ from "@/components/sections/FAQ";
import CursorGlow from "@/components/ui/CursorGlow";
import MusicToggle from "@/components/ui/MusicToggle";
import Particles from "@/components/ui/Particles";
import StickyNav from "@/components/ui/StickyNav";
import MobileStickyNav from "@/components/ui/MobileStickyNav";
import SectionReveal from "@/components/ui/SectionReveal";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = async () => {
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

  return (
    <LenisProvider>
    <main className="relative bg-background text-foreground">
      <audio ref={audioRef} src="/audio/wedding-theme.mp3" preload="metadata" loop />
      <CursorGlow />
      <Particles active={!showIntro} />
      <MusicToggle audioRef={audioRef} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      <StickyNav />
      <MobileStickyNav />
      {/*
        No scale/transform on this wrapper — transforms break position:sticky (event card stack)
        inside Events. Opacity-only keeps intro fade without killing the deck effect.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: showIntro ? 0.88 : 1,
        }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <Hero videoActive={!showIntro} />
        <CountdownScratch />
        <WeddingCountdown />
        <SectionReveal>
          <Couple />
        </SectionReveal>
        <SectionReveal opacityOnly>
          <Events />
        </SectionReveal>
        <Location />
        <FAQ />
      </motion.div>
      {showIntro && <IntroOverlay onOpen={handleOpen} onRevealComplete={() => setShowIntro(false)} />}
    </main>
    </LenisProvider>
  );
}
