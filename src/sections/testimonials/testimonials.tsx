"use client";
import React, { useState, useEffect } from 'react';

const testimonials = [
	{
		name: 'Alex P.',
		quote: 'I launched my product with basically zero marketing experience, and this tool spelled it out for me in plain English. Got my first real users in a week, no hype, just actionable steps.',
	},
	{
		name: 'Jamie L.',
		quote: 'Every marketing tool I tried before felt generic, but this one gave me a real plan for MY actual app. I finally know where my customers are and how to reach them.',
	},
  {
		name: 'Francesca T.',
		quote: 'I love it. I just generated my first marketing plan and it’s really great and helpful.',
	},
	{
		name: 'Morgan S.',
		quote: 'The plan I got was so tailored. I saw real results and new customers without blowing my budget. Best part? Straight answers.',
	},
	{
		name: 'Taylor R.',
		quote: 'I usually avoid anything ‘marketing’ because it all feels fake, but this is the real deal. Direct, brutally honest, and honestly, it’s the first time marketing made sense for me.',
	},
	{
		name: 'Jordan K.',
		quote: 'What blew me away was how fast and targeted the plan was to my situation. I had clear steps I could follow right away. If you think marketing is a waste or impossible, try this, it’s a game changer.',
	},

];

export default function TestimonialsCarousel() {
	const [index, setIndex] = useState(0);
		useEffect(() => {
			const timer = setTimeout(() => setIndex((i) => (i + 1) % testimonials.length), 4000);
			return () => clearTimeout(timer);
		}, [index]);

	const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
	const next = () => setIndex((i) => (i + 1) % testimonials.length);

	return (
			<section className="py-24 bg-[var(--secondary)]">
				<div className="container mx-auto px-6">
					<div className="max-w-2xl mx-auto">
						<h2 className="text-4xl font-extrabold text-[var(--primary)] mb-10 text-center uppercase tracking-tight border-b-4 border-[var(--primary)] pb-4">
							TESTIMONIALS
						</h2>
									<div className="flex items-center justify-center gap-0">
										<div className="flex-1 min-w-0">
											<div className="bg-[var(--secondary)] border-4 border-[var(--primary)] px-10 py-12 flex flex-col items-center min-h-[180px]" style={{ borderRadius: 0 }}>
												<blockquote className="text-2xl font-bold text-[var(--primary)] mb-8 text-center uppercase tracking-wide" style={{ letterSpacing: '0.02em' }}>
													“{testimonials[index].quote}”
												</blockquote>
												<div className="font-extrabold text-[var(--primary)] text-lg uppercase tracking-wide border-t-2 border-[var(--primary)] pt-2 w-full text-center">
													{testimonials[index].name}
												</div>
											</div>
										</div>
									</div>
						<div className="flex justify-center gap-4 mt-10">
							{testimonials.map((_, i) => (
								<button
									key={i}
									onClick={() => setIndex(i)}
									aria-label={`Go to testimonial ${i + 1}`}
									className={`w-6 h-6 border-4 border-[var(--primary)] transition ${i === index ? 'bg-[var(--primary)]' : 'bg-[var(--secondary)]'}`}
									style={{ borderRadius: 0 }}
								/>
							))}
						</div>
					</div>
				</div>
			</section>
	);
}
