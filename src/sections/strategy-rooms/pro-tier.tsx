'use client';

import React from 'react';

interface ProDisplayProps {
  formData: Record<string, string>;
  initialStrategy?: string;
  strategyId?: number;
}

export default function ProDisplay({ initialStrategy, strategyId }: ProDisplayProps) {
  const copyToClipboard = () => {
    if (initialStrategy) {
      navigator.clipboard.writeText(initialStrategy);
    }
  };

  const downloadStrategy = () => {
    if (initialStrategy) {
      const blob = new Blob([initialStrategy], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marketing-strategy-${strategyId || Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="card-square p-6 min-h-[80vh] flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b-2 border-black gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-black">Your Premium Marketing Strategy</h1>
              <p className="text-sm text-muted-foreground">Enterprise-level strategy with advanced insights</p>
              {strategyId && (
                <p className="text-xs text-gray-500 mt-1">Strategy ID: {strategyId}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {initialStrategy && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="btn-square w-full sm:w-auto"
                  >
                    Copy
                  </button>
                  <button
                    onClick={downloadStrategy}
                    className="btn-square w-full sm:w-auto"
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[60vh]">
            {initialStrategy ? (
              <div className="bg-muted text-black p-6 shadow-hard-lg border-2 border-black">
                <h3 className="font-bold mb-4 text-lg">Your Premium Marketing Strategy</h3>
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{initialStrategy}</pre>
              </div>
            ) : (
              <div className="text-center text-muted-foreground mt-20">
                <h3 className="text-lg font-semibold mb-2">No strategy found</h3>
                <p>There was an error loading your strategy. Please try generating a new one.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-black text-center">
            <p className="text-xs text-muted-foreground">
              Pro tier: Strategy saved to your account • Access all your strategies from your profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
