import { notFound } from 'next/navigation';
import { RaceClient } from './RaceClient';

export default function RacePage({ params }: { params: { id: string } }) {
  if (params.id !== '1') {
    return notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 pt-10">
      <div className="noise-overlay" />
      <RaceClient />
    </main>
  );
}
