import Link from 'next/link';

const posts = [
	{
		title: "How I'm Launching SaaS for $0",
		slug: 'how-im-launching-saas-for-0',
	},
	{
		title: 'Stop Building, Start Selling: How to Test Your SaaS Before You Waste Another Month',
		slug: 'stop-building-start-selling',
	},
	{
		title: '“Marketing Feels Like Hell”: Honest Survival Guide for Zero-Budget Founders',
		slug: 'marketing-feels-like-hell',
	},
	{
		title: 'How I Got My First Users When Nobody Knew My Name',
		slug: 'first-users-nobody-knew-my-name',
	},
	{
		title: 'Proof, Not Perfection: The Unvarnished Path to Your First 10 Sales',
		slug: 'proof-not-perfection',
	},
	{
		title: 'The One Unfair Advantage Most Beginners Miss (And How to Get It Now)',
		slug: 'unfair-advantage-beginners-miss',
	},
];

export default function BlogPage() {
	return (
		<section className="py-24 bg-[var(--secondary)] min-h-screen">
			<div className="container mx-auto px-6 max-w-3xl">
				<h1 className="text-4xl font-extrabold text-[var(--primary)] mb-10 uppercase border-b-4 border-[var(--primary)] pb-4">
					Blog
				</h1>
				<ul className="space-y-8">
					{posts.map(post => (
						<li
							key={post.slug}
							className="border-4 border-[var(--primary)] p-6"
						>
							<Link
								href={`/blog/${post.slug}`}
								className="text-2xl font-bold text-[var(--primary)] hover:underline uppercase"
							>
								{post.title}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
