'use client';

import Link from 'next/link';
import { NeonButton } from '@/components/ui/neon-button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const links = [
  { href: '/playground', label: 'Playground' },
  { href: '/race/1', label: 'Race' },
];

export default function TopNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-30 backdrop-blur-glass bg-black/30 border-b border-borderSoft/60">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <motion.div
            className="h-8 w-8 rounded-lg bg-gradient-to-br from-neonCyan to-neonViolet shadow-glow"
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div>
            <p className="text-sm text-muted uppercase tracking-[0.3em]">Data Circuit</p>
            <p className="text-text font-semibold">Hover League</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-4 text-sm text-muted">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1 rounded-md transition-colors hover:text-text',
                  'hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <NeonButton asChild>
            <Link href="/playground">Style Playground</Link>
          </NeonButton>
        </div>
      </div>
    </header>
  );
}
