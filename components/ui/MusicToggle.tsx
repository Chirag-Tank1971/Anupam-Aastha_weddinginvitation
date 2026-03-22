"use client";

import { Pause, Play } from "lucide-react";

type MusicToggleProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
};

export default function MusicToggle({ audioRef, isPlaying, setIsPlaying }: MusicToggleProps) {
  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#b23a48]/45 bg-white text-[#b23a48] shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-[#b23a48] hover:text-white"
      aria-label="Toggle background music"
    >
      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
    </button>
  );
}
