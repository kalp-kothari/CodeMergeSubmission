import api from './api';
import type { AdminStats, PaginatedSubmissions, SubmissionDetail } from '../types';

export async function login(email: string, password: string): Promise<{ token: string }> {
  const { data } = await api.post('/admin/auth/login', { email, password });
  return data;
}

export async function getMe(): Promise<{ email: string }> {
  const { data } = await api.get('/admin/auth/me');
  return data;
}

export async function getStats(): Promise<AdminStats> {
  const { data } = await api.get('/admin/stats');
  return data;
}

export async function getSubmissions(params: {
  page?: number; limit?: number; search?: string;
  domain?: string; status?: string; fileType?: string;
}): Promise<PaginatedSubmissions> {
  const { data } = await api.get('/admin/submissions', { params });
  return data;
}

export async function getSubmissionById(id: string): Promise<SubmissionDetail> {
  const { data } = await api.get(`/admin/submissions/${id}`);
  return data;
}

export async function downloadFile(id: string): Promise<{ url: string; fileName: string }> {
  const { data } = await api.get(`/admin/submissions/${id}/download`);
  return data;
}

export async function updateStatus(id: string, status: string): Promise<SubmissionDetail> {
  const { data } = await api.patch(`/admin/submissions/${id}/status`, { status });
  return data;
}

export async function exportExcel(): Promise<Blob> {
  const { data } = await api.get('/admin/export', { responseType: 'blob' });
  return data;
}
