import Link from 'next/link';

export default function MarketingFeelsLikeHellPage() {
  return (
    <article className="min-h-screen bg-[var(--secondary)] flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-2xl py-16">
        <Link href="/blog" className="text-sm text-[var(--primary)] underline mb-8 block">← Back to Blog</Link>
        <h1 className="font-bold text-4xl text-[var(--primary)] mb-8">“Marketing Feels Like Hell”: Honest Survival Guide for Zero-Budget Founders</h1>
        <div className="mb-6 flex flex-wrap gap-4 text-[var(--primary)]">
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">2025-08-14</div>
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">Team LaunchPrint</div>
          <div className="bg-[var(--primary)] text-[var(--secondary)] px-3 py-1 font-bold text-xs">2 min read</div>
          <div className="flex flex-wrap gap-2">
            {['Marketing', 'Zero Budget', 'Growth', 'Survival'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-[var(--primary)] text-[var(--secondary)] font-bold text-xs rounded">{tag}</span>
            ))}
          </div>
        </div>
        <p className="mb-4 text-[var(--primary)]">Marketing can feel like pure agony—especially if you’d rather build than sell.<br/>Anyone who says otherwise is lying or selling something.</p>
        <h2 className="text-2xl font-bold text-[var(--primary)] mt-8 mb-4">Why I Get to Say This</h2>
        <p className="mb-4 text-[var(--primary)]">Confession: I’m a marketing guy who hates most marketing. I’ve been on the floor, doubting every cold DM and watching posts die with zero engagement. It sucks. But it’s not forever—if you do the right things, it pays off.</p>
        <h2 className="text-2xl font-bold text-[var(--primary)] mt-8 mb-4">If You’re in the Pain Cave, Here’s Your Next Step:</h2>
        <ul className="list-disc list-inside mb-4 text-[var(--primary)]">
          <li>Show up where your ideal users already hang out: Reddit, tiny Discords, Slack. Watch where people vent, not just where they “promote.”</li>
          <li>Help first. Offer a real answer, not a pitch. That one comment is more powerful than 100 blog posts.</li>
          <li>Share ugly wins and losses. “Hey, this flopped, but here’s what sucked less...” People trust honesty.</li>
          <li>Track micro-wins: a DM, a thank-you, even a “not interested.” It means you poked the market.</li>
        </ul>
        <p className="mb-4 text-[var(--primary)]">I’ve written 50 posts that got nothing, then one random comment that landed my first recurring client. There’s no magic number, just a system of showing up.</p>
        <p className="mb-4 text-[var(--primary)]">You claim the “underdog” badge—people root for you when you show your story, not a polished Instagram feed.</p>
        <p className="mb-4 text-[var(--primary)]">Marketing pay-off is always weeks behind your effort, so start today. Future You will thank you for sticking with it.</p>
        <p className="mb-4 text-[var(--primary)]">Show up and answer one real question today—just one. Then log what happens.</p>
        <p className="mb-4 text-[var(--primary)]">PS: If you need a daily checklist to keep going, ping me for a free 7-day plan.<br/>PPS: Swearing (out loud, not online) helps.</p>
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
