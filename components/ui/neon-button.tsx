'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'violet' | 'danger' | 'ghost';

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: never;
  };

type LinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    href: string;
    prefetch?: boolean;
  };

export type NeonButtonProps = ButtonProps | LinkProps;

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ' +
  'transition-[transform,box-shadow,background,color,border] duration-200 select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neonCyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg0 ' +
  'active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary:
    'bg-white/10 text-text border border-borderSoft/80 shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_10px_40px_rgba(0,0,0,0.45)] ' +
    'hover:bg-white/12 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_16px_55px_rgba(0,0,0,0.55)]',
  violet:
    'bg-neonViolet/15 text-text border border-neonViolet/35 shadow-[0_0_30px_rgba(139,92,246,0.18)] ' +
    'hover:bg-neonViolet/18 hover:shadow-[0_0_40px_rgba(139,92,246,0.24)]',
  danger:
    'bg-neonRed/15 text-text border border-neonRed/35 shadow-[0_0_30px_rgba(251,113,133,0.18)] ' +
    'hover:bg-neonRed/18 hover:shadow-[0_0_40px_rgba(251,113,133,0.24)]',
  ghost:
    'bg-transparent text-text border border-borderSoft/60 hover:bg-white/6 hover:border-borderSoft/80',
};

const MotionButton = motion.button;
const MotionAnchor = motion.a;

export function NeonButton(props: NeonButtonProps) {
  const { variant = 'primary', className, children, ...rest } = props as NeonButtonProps;

  const motionProps = {
    whileHover: { y: -1 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 500, damping: 32 },
  };

  const classes = cn(base, variants[variant], className);

  // ✅ لو فيه href: نطلع Link واحد واضح -> <a> ثابت (مفيش div يتغير)
  if ('href' in props && typeof props.href === 'string') {
    const { href, prefetch, ...anchorProps } = rest as LinkProps;

    return (
      <Link href={href} prefetch={prefetch} legacyBehavior>
        <MotionAnchor {...motionProps} {...anchorProps} className={classes}>
          {children}
        </MotionAnchor>
      </Link>
    );
  }

  // ✅ لو مفيش href: يبقى زر عادي
  return (
    <MotionButton
      {...motionProps}
      {...(rest as ButtonProps)}
      type={(rest as ButtonProps).type ?? 'button'}
      className={classes}
    >
      {children}
    </MotionButton>
  );
}
