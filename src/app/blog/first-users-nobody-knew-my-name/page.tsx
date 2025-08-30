import Link from 'next/link';

export default function FirstUsersNobodyKnewMyNamePage() {
  return (
    <article className="min-h-screen bg-[var(--secondary)] flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-2xl py-16">
        <Link href="/blog" className="text-sm text-[var(--primary)] underline mb-8 block">← Back to Blog</Link>
        <h1 className="font-bold text-4xl text-[var(--primary)] mb-8">How I Got My First Users When Nobody Knew My Name</h1>
        <div className="mb-6 flex flex-wrap gap-4 text-[var(--primary)]">
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">2025-08-21</div>
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">Team LaunchPrint</div>
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">2 min read</div>
          <div className="flex flex-wrap gap-2">
            {['User Acquisition', 'Community', 'Feedback', 'Growth'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-[var(--primary)] text-[var(--secondary)] font-bold text-xs rounded">{tag}</span>
            ))}
          </div>
        </div>
        <p className="mb-4 text-[var(--primary)]">“Congrats on launching! Now what?”<br/>That pit-in-your-stomach feeling? Totally normal. Here’s how to fight it, get user #1, and build something people talk about.</p>
        <h2 className="text-2xl font-bold text-[var(--primary)] mt-8 mb-4">Do What They Won’t Teach You in Courses</h2>
        <ul className="list-disc list-inside mb-4 text-[var(--primary)]">
          <li>Pick one micro-community. Not “everyone”—just the spot where your weirdest users complain.</li>
          <li>DM five people directly. Reference something from their post, and ask for pure feedback, not a sale.</li>
          <li>Offer something for free upfront—a quick audit, a teardown, a tip. You earn trust instantly.</li>
          <li>Post your wins (tiny as they are) publicly: “First feedback, first bug fixed, first user DM.”</li>
          <li>Use their exact words as your next headline—what they say sells better than what you invent.</li>
        </ul>
        <p className="mb-4 text-[var(--primary)]">My first app’s launch was silent. The only thing that broke the silence? Relentless, awkward outreach that felt pointless, until suddenly... it didn’t.</p>
        <p className="mb-4 text-[var(--primary)]">People want to help—but only if you show up genuinely. The best users become evangelists. They brag they helped you grow.</p>
        <p className="mb-4 text-[var(--primary)]">The first ten are the hardest. Miss this window, you’re stuck in the “what if” crowd forever.</p>
        <p className="mb-4 text-[var(--primary)]">Your challenge: DM five people today with a real question about their problem. Report back on your win.<br/>PS: One is all you need to get going.</p>
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
