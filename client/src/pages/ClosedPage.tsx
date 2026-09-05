import React from 'react';
import { Link } from 'react-router';
import { XCircle } from 'lucide-react';

export function ClosedPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Submissions Closed</h1>
        <p className="text-gray-300 mb-2">
          The deadline for CodeMerge V2.0 PPT Round 1 has passed.
        </p>
        <p className="text-gray-500 mb-8 font-medium">
          Deadline: 06 September 2026 — 09:00 PM IST
        </p>
        
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
