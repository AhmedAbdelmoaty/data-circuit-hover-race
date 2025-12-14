'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export type ToastTone = 'success' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss?: (id: string) => void;
}

const toneStyles: Record<ToastTone, string> = {
  success: 'border-neonGreen/40 bg-neonGreen/10 text-neonGreen',
  warning: 'border-neonAmber/40 bg-neonAmber/10 text-neonAmber',
};

export function Toast({ messages, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-20 right-4 md:right-10 z-40 flex flex-col gap-3 w-80">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={cn(
              'glass-panel rounded-lg border px-4 py-3 shadow-panel backdrop-blur-glass',
              toneStyles[message.tone ?? 'success']
            )}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5">
                {message.tone === 'warning' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-text">{message.title}</p>
                {message.description && <p className="text-sm text-muted mt-1">{message.description}</p>}
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(message.id)}
                  className="text-xs uppercase tracking-wide text-muted hover:text-text"
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
