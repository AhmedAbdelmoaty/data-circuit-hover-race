'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/glass-panel';
import { NeonButton } from '@/components/ui/neon-button';
import { Card } from '@/components/ui/card';
import { StatPill } from '@/components/ui/stat-pill';
import { Toast, ToastMessage } from '@/components/ui/toast';
import { Activity, Gauge, Trophy, Navigation } from 'lucide-react';

const cards = Array.from({ length: 6 }, (_, i) => ({
  title: `Module ${i + 1}`,
  desc: 'Glass + glow + hover lift.',
}));

export default function PlaygroundPage() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const triggerToasts = () => {
    const payload: ToastMessage[] = [
      {
        id: 'success',
        title: 'Telemetry Synced',
        description: 'HUD data is live with 18ms latency.',
        tone: 'success',
      },
      {
        id: 'warning',
        title: 'Firmware Notice',
        description: 'Racer #7 requires calibration before next heat.',
        tone: 'warning',
      },
    ];
    setToasts(payload);
    setTimeout(() => setToasts([]), 4500);
  };

  return (
    <div className="space-y-12">
      <Toast messages={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-muted">Design System</p>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold">Style Playground</h1>
          <p className="text-muted max-w-2xl">
            Demonstration of neon components, glass panels, motion primitives, and HUD telemetry ready for the Hover League.
          </p>
        </div>
      </section>

      <GlassPanel className="p-6 space-y-6 border border-borderSoft/60">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Neon Buttons</h2>
            <p className="text-muted text-sm">Variants keep consistent padding, corners, and press feedback.</p>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <NeonButton>Primary</NeonButton>
              <NeonButton variant="violet">Violet</NeonButton>
              <NeonButton variant="danger">Danger</NeonButton>
              <NeonButton variant="ghost">Ghost</NeonButton>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Telemetry HUD</h2>
            <p className="text-muted text-sm">Pills for fast stats in dense dashboards.</p>
            <div className="flex flex-wrap gap-3">
              <StatPill icon={<Gauge size={16} />} label="Speed" value="482 km/h" tone="cyan" />
              <StatPill icon={<Activity size={16} />} label="Quality" value="97%" tone="green" />
              <StatPill icon={<Trophy size={16} />} label="Combo" value="x12" tone="violet" />
              <StatPill icon={<Navigation size={16} />} label="Position" value="#1" tone="amber" />
            </div>
          </div>
        </div>
      </GlassPanel>

      <section className="grid md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="h-full bg-panel/70">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">{card.title}</p>
            <p className="text-lg font-semibold mt-2">{card.desc}</p>
            <p className="text-sm text-muted mt-3">Hover to see lift, glow, and decisive ease-out timing.</p>
          </Card>
        ))}
      </section>

      <GlassPanel className="p-6 space-y-6 border border-borderSoft/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Toast Demo</h2>
            <p className="text-muted text-sm">Animated slide + fade with dismiss.</p>
          </div>
          <NeonButton onClick={triggerToasts}>Trigger Toasts</NeonButton>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Motion Dot</h3>
            <p className="text-sm text-muted">Micro motion proof: a neon orb sweeping along a telemetry arc.</p>
            <div className="relative h-36">
              <motion.div
                className="absolute inset-0 border border-dashed border-borderSoft/50 rounded-full"
                style={{ clipPath: 'inset(8% 8% 8% 8%)' }}
              />
              <motion.div
                className="absolute h-4 w-4 rounded-full bg-neonCyan shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                animate={{
                  x: [0, 180, 160, 0],
                  y: [0, 20, -10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">HUD Notes</h3>
            <p className="text-sm text-muted">Glass panel content ready for telemetry streams.</p>
            <GlassPanel className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted uppercase tracking-[0.25em] text-xs">Latency</span>
                <span className="text-lg font-semibold text-neonCyan">18 ms</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-muted">
                <div>
                  <p className="text-xs uppercase tracking-wide">Stability</p>
                  <p className="text-text font-semibold">99.2%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide">Energy</p>
                  <p className="text-text font-semibold">82%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide">Heat</p>
                  <p className="text-text font-semibold">43°C</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
