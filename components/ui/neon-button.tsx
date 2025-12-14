'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'violet' | 'danger' | 'ghost';

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  asChild?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-neonCyan/15 text-neonCyan border-neonCyan/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]',
  violet:
    'bg-neonViolet/15 text-neonViolet border-neonViolet/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]',
  danger:
    'bg-neonRed/15 text-neonRed border-neonRed/40 hover:shadow-[0_0_25px_rgba(251,113,133,0.5)]',
  ghost: 'bg-white/5 text-text border-borderSoft hover:bg-white/10',
};

export function NeonButton({
  children,
  className,
  variant = 'primary',
  asChild,
  ...props
}: NeonButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200',
    'uppercase tracking-wide text-sm font-semibold shadow-inner shadow-black/30',
    'relative overflow-hidden',
    variantStyles[variant],
    className
  );

  const content = (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ translateY: -1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: cn(children.props.className, baseClasses, 'group'),
      children: content,
    });
  }

  return (
    <motion.button
      className={cn(baseClasses, 'group')}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      {...props}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {content}
    </motion.button>
  );
}
