'use client';

import React from 'react';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const valueProps = [
  "Get a step-by-step marketing plan in minutes",
  "Simple instructions - no marketing jargon",
  "Tells you exactly where to post and what to say",
  "Ask follow-up questions anytime"
];

export function ValuePropositionSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Value Proposition */}
            <div>
              <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-medium mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Clock className="h-4 w-4" />
                Marketing made simple for builders
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                Get Your Marketing Strategy
                <span className="text-black block">In Plain English</span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A SaaS that helps you create simple, step-by-step marketing strategies. Get exactly where to post, how to run ads, and what metrics to track.
              </p>

              <div className="space-y-4 mb-10">
                {valueProps.map((prop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-black flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{prop}</span>
                  </div>
                ))}
              </div>

              <Link href="/pricing" className="inline-flex items-center bg-black text-white px-8 py-4 text-lg font-semibold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
                Get My Marketing Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Right Column - Simple Feature List */}
            <div className="bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <h3 className="text-2xl font-bold text-black mb-6">Perfect For</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-black mb-1">Product Builders</h4>
                    <p className="text-gray-600">You built something great, now you need people to know about it</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-black mb-1">Marketing Beginners</h4>
                    <p className="text-gray-600">No experience needed - we explain everything step by step</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-black flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-black mb-1">Busy Entrepreneurs</h4>
                    <p className="text-gray-600">Get your plan in minutes, not weeks of research</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
