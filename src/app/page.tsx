import Hero from '@/sections/hero/hero';
import { ValuePropositionSection } from '@/sections/sales/ValuePropositionSection';
import Banner from '@/elements/banner';
import TestimonialsCarousel from '@/sections/testimonials/testimonials';

export default function HomePage() {
  return (
    <main className="flex-1">
      <Banner />
      <Hero />
      <TestimonialsCarousel />
      <ValuePropositionSection />
    </main>
  );
}
