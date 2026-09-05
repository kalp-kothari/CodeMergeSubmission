import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { getSubmission } from '../services/submission';
import type { PublicSubmissionDetail } from '../types';

export function SuccessPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
const [submission, setSubmission] = useState<PublicSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (submissionId) {
      getSubmission(submissionId)
        .then(setSubmission)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [submissionId]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Submission Successful!</h1>
        <p className="text-gray-400 mb-8">CodeMerge V2.0 — PPT Round 1</p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 shadow-xl text-left">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
              <div className="h-8 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-2/3"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Team Name</p>
                <p className="font-medium text-gray-200">{submission?.teamName || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Submission ID</p>
                <p className="text-2xl font-bold text-brand-500 break-all">{submission?.submissionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Submitted At</p>
                <p className="text-sm text-gray-300">
                  {submission?.submittedAt
                    ? new Date(submission.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
                    : 'N/A'}
                </p>
              </div>
            </>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-8">
          Please save your Submission ID for future reference.
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
