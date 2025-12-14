'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { HTMLAttributes } from 'react';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      className={cn(
        'glass-panel rounded-xl p-4 border border-borderSoft/70 backdrop-blur-glass',
        'transition-all duration-200 card-glow',
        className
      )}
      whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(34, 211, 238, 0.18)' }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
