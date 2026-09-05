import api from './api';
import type { Team, SubmissionResponse, PublicSubmissionDetail } from '../types';

export async function getTeams(): Promise<Team[]> {
  const { data } = await api.get('/teams');
  return data;
}

export async function submitForm(formData: FormData): Promise<SubmissionResponse> {
  const { data } = await api.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getSubmission(submissionId: string): Promise<PublicSubmissionDetail> {
	const { data } = await api.get(`/submissions/${submissionId}`);
  return data;
}
