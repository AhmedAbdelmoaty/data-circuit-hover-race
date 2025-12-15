'use client';

import { useEffect } from 'react';
import { useSpring } from 'framer-motion';
import { Gauge, Activity, Flame, Trophy } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

function Stat({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-panel/60 border border-borderSoft/60 px-4 py-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center"
        style={{
          background: `linear-gradient(145deg, ${accent}2a, ${accent}12)`,
          boxShadow: `0 0 30px ${accent}40`,
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
        <p className="text-lg font-semibold leading-none">{value}</p>
      </div>
    </div>
  );
}

export function RaceHUD({
  speed,
  quality,
  combo,
  position,
}: {
  speed: number;
  quality: number;
  combo: number;
  position: number;
}) {
  const speedSpring = useSpring(speed, { stiffness: 110, damping: 18 });
  const qualitySpring = useSpring(quality, { stiffness: 120, damping: 20 });
  const comboSpring = useSpring(combo, { stiffness: 120, damping: 16 });
  const positionSpring = useSpring(position, { stiffness: 120, damping: 16 });

  useEffect(() => speedSpring.set(speed), [speed, speedSpring]);
  useEffect(() => qualitySpring.set(quality), [quality, qualitySpring]);
  useEffect(() => comboSpring.set(combo), [combo, comboSpring]);
  useEffect(() => positionSpring.set(position), [position, positionSpring]);

  return (
    <GlassPanel className="p-4 md:p-5 border border-borderSoft/60 bg-panel/70">
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <Stat
          label="Speed"
          value={`${Math.round(speedSpring.get())} km/h`}
          icon={<Gauge size={18} className="text-neonCyan" />}
          accent="rgba(34,211,238,0.8)"
        />
        <Stat
          label="Quality"
          value={`${Math.round(qualitySpring.get())}%`}
          icon={<Activity size={18} className="text-neonGreen" />}
          accent="rgba(52,211,153,0.9)"
        />
        <Stat
          label="Combo"
          value={`x${Math.max(1, Math.round(comboSpring.get()))}`}
          icon={<Flame size={18} className="text-neonViolet" />}
          accent="rgba(139,92,246,0.9)"
        />
        <Stat
          label="Position"
          value={`#${Math.max(1, Math.round(positionSpring.get()))}`}
          icon={<Trophy size={18} className="text-neonAmber" />}
          accent="rgba(251,191,36,0.9)"
        />
      </div>
    </GlassPanel>
  );
}
