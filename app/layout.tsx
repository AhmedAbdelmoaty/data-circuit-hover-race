import type { Metadata } from 'next';
import './globals.css';
import { inter, plexSansArabic } from './theme/fonts';
import { cn } from '@/lib/cn';
import TopNav from './components/top-nav';

export const metadata: Metadata = {
  title: 'Data Circuit',
  description: 'Premium sci-fi racing experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, plexSansArabic.variable)}>
      <body className="bg-gradient-to-b from-bg0 to-bg1 text-text min-h-screen antialiased">
        <div className="noise-overlay" aria-hidden />
        <TopNav />
        <main className="pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
