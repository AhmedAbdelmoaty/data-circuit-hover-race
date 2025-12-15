'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';

export function GateTooltip({
  title,
  note,
  tone,
}: {
  title: string;
  note: string;
  tone: 'success' | 'warning';
}) {
  const accent = tone === 'success' ? 'rgba(34,211,238,0.9)' : 'rgba(251,113,133,0.9)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
    >
      <GlassPanel className="p-4 border border-borderSoft/60 bg-panel/80 flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{
            background: `linear-gradient(145deg, ${accent}2a, ${accent}12)`,
            boxShadow: `0 0 30px ${accent}40`,
          }}
        >
          <Sparkles size={18} className={tone === 'success' ? 'text-neonCyan' : 'text-neonRed'} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Gate effect</p>
          <p className="text-lg font-semibold leading-tight">{title}</p>
          <p className="text-sm text-muted mt-1">{note}</p>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
