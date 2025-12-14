import { cn } from '@/lib/cn';
import { HTMLAttributes } from 'react';

export function GlassPanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass-panel rounded-xl relative overflow-hidden', className)} {...props} />;
}
