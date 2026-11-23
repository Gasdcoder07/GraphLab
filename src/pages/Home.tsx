import { useState } from 'react';
import { BentoGrid } from '../components/home/BentoGrid';
import { Hero, HeroStats } from '../components/home/Hero';
import { HomeFooter } from '../components/home/HomeFooter';
import { HomeNav } from '../components/home/HomeNav';
import type { LabId } from '../data/labs';

interface HomeProps {
  onOpenGraph: () => void;
}

export function Home({ onOpenGraph }: HomeProps) {
  const [selectedLabId, setSelectedLabId] = useState<LabId>('graphs');
  return (
    <div className="home">
      <HomeNav />

      <main className="home__main">
        <Hero onOpenGraph={onOpenGraph} />
        <HeroStats />

        <BentoGrid
          selectedLabId={selectedLabId}
          onSelect={setSelectedLabId}
          onOpenGraph={onOpenGraph}
        />
      </main>

      <HomeFooter />
    </div>
  );
}