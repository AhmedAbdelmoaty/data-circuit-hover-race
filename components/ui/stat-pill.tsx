import { cn } from '@/lib/cn';
import { HTMLAttributes, ReactNode } from 'react';

interface StatPillProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  value: string;
  label: string;
  tone?: 'cyan' | 'violet' | 'green' | 'amber';
}

const toneStyles: Record<NonNullable<StatPillProps['tone']>, string> = {
  cyan: 'text-neonCyan bg-neonCyan/10 border-neonCyan/30',
  violet: 'text-neonViolet bg-neonViolet/10 border-neonViolet/30',
  green: 'text-neonGreen bg-neonGreen/10 border-neonGreen/30',
  amber: 'text-neonAmber bg-neonAmber/10 border-neonAmber/30',
};

export function StatPill({ icon, value, label, className, tone = 'cyan', ...props }: StatPillProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-full border text-sm font-medium backdrop-blur-glass',
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <div className="flex flex-col leading-tight">
        <span className="text-xs uppercase tracking-widest text-muted">{label}</span>
        <span className="text-base font-semibold">{value}</span>
      </div>
    </div>
  );
}
