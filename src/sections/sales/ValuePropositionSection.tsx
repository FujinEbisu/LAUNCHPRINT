'use client';

import React from 'react';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const valueProps = [
  "Exact step-by-step plan (no confusing jargon)",
  "Where to post your stuff (and where NOT to waste time)",
  "What to say that actually gets people to buy",
  "How to track what's working (spoiler: it's not what you think)",
  "Direct answers to your specific questions anytime"
];

const perfectIf = [
  "A builder who built something awesome but crickets on sales",
  "Completely new to marketing (good, less bad habits to unlearn)",
  "Too busy building to spend weeks researching marketing nonsense",
];

const notForYouIf = [
  "You already have marketing figured out",
  "You want to become a marketing guru",
  "You prefer doing things the hard way",
];

export function ValuePropositionSection() {
  return (
    <section className="py-24 bg-[var(--secondary)]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)] text-[var(--secondary)] text-sm font-medium mb-6 border-2 border-[var(--primary)]">
                <Clock className="h-4 w-4" />
                In under 10 minutes
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6 leading-tight">
                Frustrated by Marketing That Wastes Your Money? Get a Step-by-Step Plan Built for Builders Who Hate Marketing—See Real Results, Even on a Small Budget!
                <span className="text-black block">A Marketing Plan That Actually Makes Sense for Builders Who Hate Marketing</span>
              </h2>

              <p className="text-xl text-[var(--muted)] mb-8 leading-relaxed max-w-prose">
                Listen, I&apos;ll be honest. Most marketing advice is garbage written by people who never built anything real. That&apos;s why I created this tool. Because I watched too many brilliant builders fail not because their product sucked, but because nobody knew it existed.
              </p>

              <div className="card-square p-6 md:p-8 mb-10">
                <h3 className="text-xl font-semibold text-[var(--primary)] mb-4">Here&apos;s what you get in under 10 minutes:</h3>
                <div className="space-y-4">
                  {valueProps.map((prop, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-[var(--primary)] flex-shrink-0" />
                      <span className="text-[var(--muted)] text-lg">{prop}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[var(--muted)] mb-8 leading-relaxed max-w-prose">
                Why now? Because every day you wait, your competitors get further ahead. And frankly, your product deserves better than sitting in the shadows.
              </p>

              <Link href="/pricing" className="btn-square inline-flex items-center text-base md:text-lg">
                Get Your Marketing Plan in 10 Minutes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <div className="mt-6 space-y-2">
                <p className="text-[var(--muted)] text-sm">
                  PS: This isn&apos;t some generic template. You answer questions about YOUR specific product and situation. The plan you get is built for what you actually built, not some imaginary startup in Silicon Valley.
                </p>
                <p className="text-[var(--muted)] text-sm">
                  PPS: Still not sure? Fair enough. Most marketing tools promise the moon and deliver cheese. That&apos;s exactly why I built this differently.
                </p>
                <p className="text-[var(--muted)] text-sm">
                  Just try it out. If it&apos;s not the best marketing advice you&apos;ve ever gotten, I&apos;ll personally refund your money and apologize for wasting your time.
                </p>
              </div>
            </div>

            {/* Sidebar Card */}
            <aside className="card-square p-8 lg:sticky top-8 h-fit">
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-6">Perfect if you&apos;re:</h3>

              <div className="space-y-6">
                {perfectIf.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[var(--primary)] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[var(--primary)] mb-1">{item}</h4>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-[var(--primary)] my-8" />
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-6">NOT for you if:</h3>

              <div className="space-y-6">
                {notForYouIf.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[var(--primary)] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-[var(--primary)] mb-1">{item}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
