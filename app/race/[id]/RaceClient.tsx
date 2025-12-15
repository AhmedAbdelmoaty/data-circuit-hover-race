'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { raceOneGates } from '@/lib/game/race-data';
import { RaceCanvas, type GateState } from '@/components/race/RaceCanvas';
import { RaceHUD } from '@/components/race/RaceHUD';
import { GateTooltip } from '@/components/race/GateTooltip';
import { NeonButton } from '@/components/ui/neon-button';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function RaceClient() {
  const [countdown, setCountdown] = useState<number | 'GO' | null>(3);
  const [status, setStatus] = useState<'countdown' | 'running' | 'finished'>('countdown');
  const [playerX, setPlayerX] = useState(0);
  const [hudSpeed, setHudSpeed] = useState(180);
  const [hudQuality, setHudQuality] = useState(94);
  const [hudCombo, setHudCombo] = useState(1);
  const [hudPosition, setHudPosition] = useState(6);
  const [gateFlash, setGateFlash] = useState<'success' | 'fail' | null>(null);
  const [lastGateNote, setLastGateNote] = useState<{ title: string; note: string; tone: 'success' | 'warning' } | null>(null);

  const gates = useRef<GateState[]>(raceOneGates.map((g) => ({ ...g, passed: false })));
  const input = useRef({ left: false, right: false });
  const travel = useRef(0);
  const speed = useRef(180);
  const combo = useRef(1);
  const quality = useRef(94);
  const targetX = useRef(0);
  const lastTime = useRef<number | null>(null);

  const reset = () => {
    setCountdown(3);
    setStatus('countdown');
    gates.current = raceOneGates.map((g) => ({ ...g, passed: false }));
    input.current = { left: false, right: false };
    travel.current = 0;
    speed.current = 180;
    combo.current = 1;
    quality.current = 94;
    targetX.current = 0;
    lastTime.current = null;
    setHudSpeed(180);
    setHudQuality(94);
    setHudCombo(1);
    setHudPosition(6);
    setGateFlash(null);
    setLastGateNote(null);
  };

  useEffect(() => {
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') input.current.left = true;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') input.current.right = true;
    };
    const keyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') input.current.left = false;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') input.current.right = false;
    };
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, []);

  useEffect(() => {
    if (status !== 'countdown') return;
    let current = 3;
    setCountdown(current);
    const interval = window.setInterval(() => {
      current -= 1;
      if (current === 0) {
        setCountdown('GO');
      } else if (current < 0) {
        setCountdown(null);
        setStatus('running');
        window.clearInterval(interval);
      } else {
        setCountdown(current);
      }
    }, 900);
    return () => window.clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'running') return;

    let raf = 0;

    const step = (timestamp: number) => {
      if (lastTime.current === null) lastTime.current = timestamp;
      const dt = (timestamp - (lastTime.current ?? timestamp)) / 1000;
      lastTime.current = timestamp;

      // Input smoothing
      const direction = (input.current.right ? 1 : 0) - (input.current.left ? 1 : 0);
      targetX.current = clamp(targetX.current + direction * dt * 1.8, -1, 1);
      setPlayerX((prev) => {
        const eased = prev + (targetX.current - prev) * Math.min(1, dt * 8);
        return clamp(eased, -1, 1);
      });

      // Speed + travel
      travel.current += speed.current * dt * 0.6;
      speed.current = clamp(speed.current + dt * 14, 140, 340);

      gates.current.forEach((gate) => {
        if (!gate.passed && travel.current >= gate.distance) {
          gate.passed = true;
          const chosen = targetX.current < 0 ? gate.left : gate.right;
          const success = chosen.correct;
          gate.result = success ? 'success' : 'fail';
          if (success) {
            speed.current = clamp(speed.current + 45, 140, 380);
            combo.current += 1;
            quality.current = clamp(quality.current + 2.2, 60, 100);
            setGateFlash('success');
            setLastGateNote({ title: `${chosen.label} ✓`, note: chosen.note, tone: 'success' });
          } else {
            speed.current = clamp(speed.current - 55, 120, 360);
            combo.current = 1;
            quality.current = clamp(quality.current - 3.8, 60, 100);
            setGateFlash('fail');
            setLastGateNote({ title: `${chosen.label} ✕`, note: chosen.note, tone: 'warning' });
          }
        }
      });

      // HUD smoothing
      setHudSpeed((prev) => prev + (speed.current - prev) * Math.min(1, dt * 5));
      setHudQuality((prev) => prev + (quality.current - prev) * Math.min(1, dt * 4));
      setHudCombo((prev) => prev + (combo.current - prev) * Math.min(1, dt * 6));

      const desiredPosition = clamp(Math.round(6 - combo.current / 1.6), 1, 6);
      setHudPosition((prev) => prev + (desiredPosition - prev) * Math.min(1, dt * 4));

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  return (
    <div className="space-y-6 pb-10">
      <div className="relative overflow-hidden rounded-3xl border border-borderSoft/60 bg-gradient-to-b from-panel/80 via-panel/60 to-black/70">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.08),transparent_35%)]" />
        <div className="p-4 md:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted">Data Circuit</p>
              <h1 className="text-3xl md:text-4xl font-semibold text-gradient">Hover League: Race #1</h1>
              <p className="text-muted text-sm max-w-xl mt-2">
                Steer the capsule through clean-data gates. Correct calls give boost + glow, misses glitch and slow you.
              </p>
            </div>
            <div className="hidden md:flex gap-2 text-xs text-muted uppercase tracking-[0.2em]">
              <span className="px-3 py-1 rounded-full border border-borderSoft/60 bg-panel/60">← →</span>
              <span className="px-3 py-1 rounded-full border border-borderSoft/60 bg-panel/60">A / D</span>
            </div>
          </div>

          <RaceHUD speed={hudSpeed} quality={hudQuality} combo={hudCombo} position={hudPosition} />

          <div className="relative h-[65vh] min-h-[480px]">
            <RaceCanvas playerX={playerX} gates={gates.current} progress={travel.current} speed={hudSpeed} gateFlash={gateFlash} />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence>
                {countdown !== null && (
                  <motion.div
                    key={String(countdown)}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="px-10 py-6 rounded-3xl border border-borderSoft/70 bg-black/70 shadow-[0_0_60px_rgba(34,211,238,0.35)]"
                  >
                    <p className="text-center text-5xl font-semibold tracking-wide text-gradient">
                      {typeof countdown === 'number' ? countdown : 'GO!'}
                    </p>
                    <p className="text-center text-muted text-sm mt-2">Engine hum + neon fans spinning...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute top-4 right-4 flex gap-3">
              <div className="px-3 py-2 rounded-xl bg-panel/80 border border-borderSoft/60 text-xs uppercase tracking-[0.25em] text-muted">
                WASD + Arrows
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="text-sm text-muted">
                Pass gates: correct = cyan boost + glow. Wrong = red glitch + slowdown. Tooltips recap why.
              </div>
              <AnimatePresence>
                {lastGateNote && (
                  <GateTooltip title={lastGateNote.title} note={lastGateNote.note} tone={lastGateNote.tone} />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 rounded-full bg-neonCyan shadow-[0_0_12px_rgba(34,211,238,0.9)]" /> Boost lane
              <span className="h-2 w-2 rounded-full bg-neonRed shadow-[0_0_12px_rgba(251,113,133,0.9)] ml-3" /> Glitch lane
              <span className="h-2 w-2 rounded-full bg-neonViolet shadow-[0_0_12px_rgba(139,92,246,0.9)] ml-3" /> Combo climbs position
            </div>
            <NeonButton variant="ghost" onClick={reset}>
              Restart Heat
            </NeonButton>
          </div>
        </div>
      </div>
    </div>
  );
}
