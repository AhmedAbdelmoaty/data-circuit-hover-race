import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg0: 'var(--color-bg0)',
        bg1: 'var(--color-bg1)',
        panel: 'var(--color-panel)',
        borderSoft: 'var(--color-border-soft)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        neonCyan: 'var(--color-neon-cyan)',
        neonViolet: 'var(--color-neon-violet)',
        neonGreen: 'var(--color-neon-green)',
        neonAmber: 'var(--color-neon-amber)',
        neonRed: 'var(--color-neon-red)',
      },
      boxShadow: {
        glow: '0 0 35px rgba(34, 211, 238, 0.35)',
        panel: '0 20px 60px rgba(0,0,0,0.45)',
      },
      borderRadius: {
        xl: '16px',
      },
      backdropBlur: {
        glass: '12px',
      },
      animation: {
        pulseSlow: 'pulseSlow 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
