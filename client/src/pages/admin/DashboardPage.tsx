import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router';
import { Download, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getStats, getSubmissions, exportExcel } from '../../services/admin';
import type { AdminStats, PaginatedSubmissions } from '../../types';

export function DashboardPage() {
  const { logout } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [data, setData] = useState<PaginatedSubmissions | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState('');
  const [fileType, setFileType] = useState('');

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSubmissions({ page, limit: 10, search, domain, status, fileType });
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, search, domain, status, fileType]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleExport = async () => {
    try {
      const blob = await exportExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'SUBMITTED': return 'bg-blue-500/20 text-blue-400';
      case 'UNDER_REVIEW': return 'bg-yellow-500/20 text-yellow-400';
      case 'SHORTLISTED': return 'bg-green-500/20 text-green-400';
      case 'REJECTED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-100">CodeMerge V2.0 — PPT Round 1</h1>
          <p className="text-sm text-brand-500">Admin Dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleExport} className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
          <button onClick={logout} className="flex items-center px-4 py-2 border border-gray-700 hover:bg-gray-800 text-gray-300 text-sm font-medium rounded-lg transition-colors">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm font-medium">Total Submissions</p>
            <p className="text-3xl font-bold text-blue-500 mt-2">{stats?.total || 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm font-medium">PDF Files</p>
            <p className="text-3xl font-bold text-red-500 mt-2">{(stats as any)?.fileTypes?.pdf || 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm font-medium">PPTX Files</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">{(stats as any)?.fileTypes?.pptx || 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm font-medium">Submitted Today</p>
            <p className="text-3xl font-bold text-green-500 mt-2">{(stats as any)?.submittedToday || 0}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center bg-gray-900/50">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by team, ID, email..." 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-brand-500 outline-none"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none" value={domain} onChange={(e) => { setDomain(e.target.value); setPage(1); }}>
              <option value="">All Domains</option>
              <option value="Web Development">Web Dev</option>
              <option value="Artificial Intelligence / Machine Learning">AI/ML</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Other">Other</option>
            </select>
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none" value={fileType} onChange={(e) => { setFileType(e.target.value); setPage(1); }}>
              <option value="">All File Types</option>
              <option value="pdf">PDF</option>
              <option value="pptx">PPTX</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-800/50 text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Team</th>
                  <th className="px-4 py-3 font-medium">Domain</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : data?.submissions.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No submissions found</td></tr>
                ) : (
                  data?.submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-800/30">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{sub.submissionId.substring(0, 8)}...</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-200">{sub.team.teamName}</p>
                        <p className="text-xs text-gray-500">{sub.leaderEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-300 truncate max-w-[150px]">{sub.domain}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-800 rounded text-xs font-medium text-gray-300 uppercase">
                          {sub.fileType.includes('pdf') ? 'PDF' : 'PPTX'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(sub.submittedAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(sub.status)}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/submissions/${sub.id}`} className="text-brand-400 hover:text-brand-300 font-medium">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-800 flex justify-between items-center bg-gray-900/50">
            <button 
              disabled={page === 1 || loading}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-sm text-gray-300"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {data?.page || 1} of {data?.totalPages || 1}
            </span>
            <button 
              disabled={page === (data?.totalPages || 1) || loading}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-sm text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
