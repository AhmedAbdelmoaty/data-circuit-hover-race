import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Adaptive Neon UI',
    description: 'Responsive HUD with glass panels, motion micro-interactions, and Tron-inspired glow.',
  },
  {
    title: 'Telemetry-Ready',
    description: 'Design system tuned for racing metrics, leaderboards, and fast updates.',
  },
  {
    title: 'Premium Motion',
    description: 'Framer Motion driven transitions with decisive ease-out timing.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-borderSoft px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted bg-white/5">
            Sci-fi Hover League
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Data Circuit
              <span className="block text-gradient">Premium Neon Interface</span>
            </h1>
            <p className="text-lg text-muted max-w-xl">
              Bootstrapped design system for our upcoming hover race. Explore the playground to see neon panels, HUD tokens, and motion language before gameplay lands.
            </p>
          </div>
          <div className="flex gap-4">
            <NeonButton asChild>
              <Link href="/playground" className="gap-2">
                <Play size={16} />
                Enter Playground
              </Link>
            </NeonButton>
            <NeonButton variant="ghost" asChild>
              <Link href="/race/1" className="gap-2">
                <ArrowRight size={16} />
                Preview Race
              </Link>
            </NeonButton>
          </div>
        </div>
        <GlassPanel className="p-6 border border-borderSoft/70 backdrop-blur-glass relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-neonCyan/10 via-transparent to-neonViolet/15"
            animate={{ opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">UI Stack</p>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <Card key={feature.title} className="p-4 bg-panel/60">
                  <p className="text-sm text-muted uppercase tracking-wide">{feature.title}</p>
                  <p className="text-base text-text mt-2 leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
            <div className="rounded-lg border border-borderSoft px-4 py-3 flex items-center justify-between bg-black/30">
              <div>
                <p className="text-sm text-muted">Next milestone</p>
                <p className="text-lg font-semibold text-text">Race HUD & telemetrics</p>
              </div>
              <motion.div
                className="h-12 w-12 rounded-full border border-borderSoft flex items-center justify-center"
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="text-neonCyan" />
              </motion.div>
            </div>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
