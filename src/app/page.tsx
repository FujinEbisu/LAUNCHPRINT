import Hero from '@/sections/hero/hero';
import { ValuePropositionSection } from '@/sections/sales/ValuePropositionSection';

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <ValuePropositionSection />
    </main>
  );
}
