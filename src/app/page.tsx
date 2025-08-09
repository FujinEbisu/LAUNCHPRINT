import Hero from '@/sections/hero/hero';
import { ValuePropositionSection } from '@/sections/sales/ValuePropositionSection';
import Banner from '@/elements/banner';

export default function HomePage() {
  return (
    <main className="flex-1">
      <Banner />
      <Hero />
      <ValuePropositionSection />
    </main>
  );
}
