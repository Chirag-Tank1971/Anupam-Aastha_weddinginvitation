/** Soft celebration chime using Web Audio (no external file). */
export function playRevealChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const makeTone = (freq: number, start: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(volume, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration + 0.05);
    };

    makeTone(880, 0, 0.22, 0.06);
    makeTone(1174.66, 0.12, 0.25, 0.05);
    makeTone(1318.51, 0.24, 0.35, 0.04);

    ctx.resume?.();
  } catch {
    /* ignore */
  }
}
