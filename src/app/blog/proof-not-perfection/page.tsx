import Link from 'next/link';

export default function ProofNotPerfectionPage() {
  return (
    <article className="min-h-screen bg-[var(--secondary)] flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-2xl py-16">
        <Link href="/blog" className="text-sm text-[var(--primary)] underline mb-8 block">← Back to Blog</Link>
        <h1 className="font-bold text-4xl text-[var(--primary)] mb-8">Proof, Not Perfection: The Unvarnished Path to Your First 10 Sales</h1>
        <div className="mb-6 flex flex-wrap gap-4 text-[var(--primary)]">
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">2025-08-28</div>
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">Team LaunchPrint</div>
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">2 min read</div>
          <div className="flex flex-wrap gap-2">
            {['Proof', 'Sales', 'Trust', 'Growth'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-[var(--primary)] text-[var(--secondary)] font-bold text-xs rounded">{tag}</span>
            ))}
          </div>
        </div>
        <p className="mb-4 text-[var(--primary)]">I used to chase shipping the “perfect product.” All that does? Keep your wallet empty.<br/>What matters: tangible proof, even if it’s ugly.</p>
        <h2 className="text-2xl font-bold text-[var(--primary)] mt-8 mb-4">What’s Worked for Me (and Nobody Teaches)</h2>
        <ul className="list-disc list-inside mb-4 text-[var(--primary)]">
          <li>Do the first job for free. Your price is: proof and a testimonial.</li>
          <li>Get three specifics from that first happy customer—time saved, money made, one killer quote.</li>
          <li>Turn that proof into a micro-demo (a 45-second video, a screenshot, or a direct quote on your home page).</li>
          <li>Offer “first 10 buyers get X” (free onboarding, founder call, custom feature, etc.). Scarcity fuels action.</li>
        </ul>
        <p className="mb-4 text-[var(--primary)]">My flagship product only took off when I admitted it missed features. I owned up—and users lined up, because they believed what I owned.</p>
        <p className="mb-4 text-[var(--primary)]">Early customers get to say, “I was there when...” They become references, not just numbers.</p>
        <p className="mb-4 text-[var(--primary)]">Perfection is just procrastination with a fancy hat on.</p>
        <p className="mb-4 text-[var(--primary)]">First sale missing? Give away a free trial, ask for the testimonial, and splash it everywhere.<br/>PS: Proof builds trust faster than polish ever will.</p>
        <div className="mt-12 flex justify-center">
          <Link
            href="/pricing"
            className="bg-[var(--primary)] text-[var(--secondary)] font-bold px-8 py-4 shadow-lg text-xl"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>
    </article>
  );
}
