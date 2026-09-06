import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Clock } from 'lucide-react';

export function LandingPage() {
  const [isClosed, setIsClosed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Hardcoded deadline: 06 September 2026 — 09:00 PM IST
    const deadline = new Date('2026-09-06T23:30:00+05:30');
    if (new Date() > deadline) {
      setIsClosed(true);
      navigate('/closed');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            CodeMerge V2.0
          </h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">PPT Round 1 Submission Portal</h2>
          <p className="text-gray-400">Submit your presentation for CodeMerge V2.0 PPT Round 1.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Submission Rules</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-brand-500 mr-2">•</span>
              Follow the PPT guidelines shared in the WhatsApp group
            </li>
            <li className="flex items-start">
              <span className="text-brand-500 mr-2">•</span>
              All team details must be entered correctly
            </li>
            <li className="flex items-start">
              <span className="text-brand-500 mr-2">•</span>
              Upload the final version of your presentation
            </li>
            <li className="flex items-start">
              <span className="text-brand-500 mr-2">•</span>
              Only one submission per team is allowed
            </li>
            <li className="flex items-start">
              <span className="text-brand-500 mr-2">•</span>
              Late or incomplete submissions will not be accepted
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center shadow-lg">
            <div className="p-3 bg-brand-500/10 rounded-lg text-brand-400 mr-4">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Deadline</p>
              <p className="text-sm font-medium text-gray-200">06 September 2026 — 09:00 PM IST</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center shadow-lg">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 mr-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">File Info</p>
              <p className="text-sm font-medium text-gray-200">Accepted: PDF, PPTX • Max 10 MB</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/submit"
            className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/20"
          >
            Proceed to Submission
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
