'use client';

import { useEffect, useRef } from 'react';
import type { RaceGate } from '@/lib/game/race-data';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export type GateState = RaceGate & { passed: boolean; result?: 'success' | 'fail' };

interface RaceCanvasProps {
  playerX: number; // -1 to 1 normalized
  gates: GateState[];
  progress: number;
  speed: number;
  gateFlash: 'success' | 'fail' | null;
}

export function RaceCanvas({ playerX, gates, progress, speed, gateFlash }: RaceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trackScroll = useRef(0);
  const flashTimer = useRef<number | null>(null);
  const gateFlashRef = useRef(gateFlash);
  const playerXRef = useRef(playerX);
  const progressRef = useRef(progress);
  const speedRef = useRef(speed);
  const gatesRef = useRef(gates);

  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    gatesRef.current = gates;
  }, [gates]);

  useEffect(() => {
    gateFlashRef.current = gateFlash;
    if (flashTimer.current) {
      window.clearTimeout(flashTimer.current);
    }
    if (gateFlash) {
      flashTimer.current = window.setTimeout(() => {
        gateFlashRef.current = null;
      }, 350);
    }
  }, [gateFlash]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      trackScroll.current = (trackScroll.current + speedRef.current * dt * 0.6) % 80;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Background glow
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, 'rgba(10,15,30,0.95)');
      gradient.addColorStop(1, 'rgba(15,25,45,0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Track body with perspective taper
      ctx.save();
      ctx.translate(width / 2, height);
      ctx.beginPath();
      const bottomWidth = width * 0.7;
      const topWidth = width * 0.38;
      ctx.moveTo(-bottomWidth / 2, 0);
      ctx.lineTo(-topWidth / 2, -height);
      ctx.lineTo(topWidth / 2, -height);
      ctx.lineTo(bottomWidth / 2, 0);
      ctx.closePath();
      ctx.fillStyle = 'rgba(18,29,50,0.9)';
      ctx.fill();
      ctx.clip();

      // Moving lane markers
      const laneGradient = ctx.createLinearGradient(0, 0, 0, -height);
      laneGradient.addColorStop(0, 'rgba(34,211,238,0.14)');
      laneGradient.addColorStop(1, 'rgba(139,92,246,0.07)');
      ctx.strokeStyle = laneGradient;
      ctx.lineWidth = 3;
      const stripeGap = 90;
      for (let y = -height; y < height; y += stripeGap) {
        const offsetY = y + (trackScroll.current % stripeGap);
        ctx.beginPath();
        const stripeWidthBottom = bottomWidth * 0.4;
        const stripeWidthTop = topWidth * 0.28;
        const taper = (height + offsetY) / height;
        const currentStripeWidth = stripeWidthTop + (stripeWidthBottom - stripeWidthTop) * taper;
        ctx.moveTo(-currentStripeWidth / 2, offsetY);
        ctx.lineTo(currentStripeWidth / 2, offsetY + 30);
        ctx.stroke();
      }

      // Outer rails
      ctx.lineWidth = 4;
      const railGradient = ctx.createLinearGradient(0, 0, 0, -height);
      railGradient.addColorStop(0, 'rgba(139,92,246,0.9)');
      railGradient.addColorStop(1, 'rgba(34,211,238,0.9)');
      ctx.strokeStyle = railGradient;
      ctx.beginPath();
      ctx.moveTo(-bottomWidth / 2, 0);
      ctx.lineTo(-topWidth / 2, -height);
      ctx.moveTo(bottomWidth / 2, 0);
      ctx.lineTo(topWidth / 2, -height);
      ctx.stroke();

      const projectDistance = (distanceAhead: number) => {
        const viewRange = 1100;
        const ratio = clamp(distanceAhead / viewRange, 0, 1);
        return height - ratio * height;
      };

      const widthAtY = (y: number) => {
        const ratio = 1 - y / height;
        return topWidth + (bottomWidth - topWidth) * ratio;
      };

      // Gates
      gatesRef.current.forEach((gate) => {
        const distanceAhead = gate.distance - progressRef.current;
        if (distanceAhead < -120 || distanceAhead > 1100) return;
        const gateY = projectDistance(distanceAhead);
        const gateWidth = widthAtY(gateY) * 0.88;
        const gateHeight = 36;
        const gateGlow = gate.result === 'success' ? 'rgba(34,211,238,0.6)' : gate.result === 'fail' ? 'rgba(251,113,133,0.45)' : 'rgba(255,255,255,0.25)';

        const drawGateHalf = (offset: number, label: string, color: string) => {
          ctx.save();
          ctx.translate(offset, gateY);
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 18;
          drawRoundedRect(ctx, -gateWidth / 2, -gateHeight / 2, gateWidth, gateHeight, 10);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.font = '14px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, 0, 4);
          ctx.restore();
        };

        drawGateHalf(-gateWidth * 0.26, gate.left.label, `${gateGlow}`);
        drawGateHalf(gateWidth * 0.26, gate.right.label, `${gateGlow}`);

        // Gate outline
        ctx.save();
        ctx.translate(0, gateY);
        ctx.strokeStyle = gateGlow;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-gateWidth / 2, -gateHeight / 2);
        ctx.lineTo(-gateWidth / 2, gateHeight / 2);
        ctx.moveTo(gateWidth / 2, -gateHeight / 2);
        ctx.lineTo(gateWidth / 2, gateHeight / 2);
        ctx.stroke();
        ctx.restore();
      });

      // Player
      const playerY = height * 0.8;
      const playerWidth = widthAtY(playerY) * 0.16;
      const xOffset = (playerWidth * 6) * playerX;
      ctx.save();
      ctx.translate(width / 2 + xOffset, playerY);
      const capsuleGradient = ctx.createLinearGradient(0, -20, 0, 20);
      capsuleGradient.addColorStop(0, 'rgba(34,211,238,0.95)');
      capsuleGradient.addColorStop(1, 'rgba(139,92,246,0.9)');
      ctx.fillStyle = capsuleGradient;
      ctx.shadowColor = gateFlashRef.current === 'fail' ? 'rgba(251,113,133,0.8)' : 'rgba(34,211,238,0.9)';
      ctx.shadowBlur = gateFlashRef.current ? 30 : 18;
      drawRoundedRect(ctx, -playerWidth / 2, -18, playerWidth, 36, 16);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(-playerWidth * 0.15, -16, playerWidth * 0.3, 32);
      ctx.restore();

      ctx.restore();

      // Vignette overlay
      const vignette = ctx.createRadialGradient(width / 2, height * 0.6, width * 0.18, width / 2, height * 0.6, width * 0.7);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full rounded-3xl border border-borderSoft/60 bg-black/60" />;
}
