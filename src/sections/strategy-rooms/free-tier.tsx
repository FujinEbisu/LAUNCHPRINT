'use client';

import React from 'react';

interface FreeTierDisplayProps {
  formData: Record<string, string>;
  initialStrategy?: string;
  initialError?: string;
}

export default function FreeTierDisplay({ formData, initialStrategy, initialError }: FreeTierDisplayProps) {
  // Create a summary of what the user submitted
  const userProblem = formData.problem || 'Not specified';
  const summary = `**Based on what you told us:**\n- ${userProblem}\n\n**Here is your personalized marketing strategy:**`;

  const copyToClipboard = () => {
    if (initialStrategy) {
      navigator.clipboard.writeText(initialStrategy);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card-square p-6 min-h-[70vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-black">
            <h1 className="text-2xl font-bold text-[var(--secondary)]">Your Marketing Strategy</h1>
            {initialStrategy && (
              <button
                onClick={copyToClipboard}
                className="btn-square"
              >
                Copy Strategy
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {initialError ? (
              <div className="text-center text-red-600 mt-20">
                <p className="text-lg font-semibold mb-2">Error</p>
                <p>{initialError}</p>
              </div>
            ) : initialStrategy ? (
              <>
                <div className="bg-muted text-black p-4 shadow-hard mr-auto">
                  <div className="mb-2">{summary}</div>
                </div>
                <div className="bg-muted text-black p-4 shadow-hard-lg border-2 border-black">
                  <h3 className="font-bold mb-2">Your Marketing Strategy</h3>
                  <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{initialStrategy}</pre>
                </div>
              </>
            ) : (
              <div className="text-center text-[var(--primary)] mt-20">
                Your marketing strategy will appear here.
              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-black text-center">
            <p className="text-sm text-[var(--muted)]">
              Free tier: Strategy is not saved. Upgrade for strategy history and more features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
