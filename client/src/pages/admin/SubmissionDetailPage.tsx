import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { getSubmissionById, downloadFile, updateStatus } from '../../services/admin';
import type { SubmissionDetail } from '../../types';

export function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [sub, setSub] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusVal, setStatusVal] = useState('');

  useEffect(() => {
    if (id) {
      getSubmissionById(id)
        .then(data => {
          setSub(data);
          setStatusVal(data.status);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDownload = async () => {
    if (!id) return;
    try {
      const res = await downloadFile(id);
      window.open(res.url, '_blank');
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to get download URL.');
    }
  };

  const handleUpdateStatus = async () => {
    if (!id || statusVal === sub?.status) return;
    setUpdating(true);
    try {
      const updated = await updateStatus(id, statusVal);
      setSub(updated);
      alert('Status updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950 p-6 flex justify-center text-gray-100">Loading...</div>;
  if (!sub) return <div className="min-h-screen bg-gray-950 p-6 flex justify-center text-gray-100">Submission not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/admin" className="inline-flex items-center text-gray-400 hover:text-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800 flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Submission ID</p>
              <h2 className="text-2xl font-bold font-mono text-brand-500">{sub.submissionId}</h2>
              <p className="text-sm text-gray-400 mt-2">
                Submitted: {new Date(sub.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg flex items-center space-x-3">
              <select 
                value={statusVal}
                onChange={e => setStatusVal(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 outline-none"
              >
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="WITHDRAWN">WITHDRAWN</option>
              </select>
              <button 
                onClick={handleUpdateStatus}
                disabled={updating || statusVal === sub.status}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded transition-colors"
              >
                {updating ? '...' : 'Update'}
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Team Information</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Team Name</p>
                    <p className="font-medium text-gray-200">{sub.team.teamName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Leader Email</p>
                    <p className="text-gray-300">{sub.leaderEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Leader Contact</p>
                    <p className="text-gray-300">{sub.leaderContact}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Presentation File</h3>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="p-2 bg-brand-500/20 rounded-lg text-brand-400 flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-gray-200 truncate">{sub.fileName}</p>
                      <p className="text-xs text-gray-400">{(sub.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDownload}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors ml-4 flex-shrink-0"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Project Details</h3>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Domain</p>
                    <span className="inline-block px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-sm text-gray-300">
                      {sub.domain}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Problem Statement</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{sub.problemStatement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Solution Summary</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{sub.solutionSummary}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
