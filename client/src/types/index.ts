export interface Team {
  id: string;
  teamName: string;
}

export interface RoundInfo {
  id: string;
  name: string;
  slug: string;
  submissionDeadline: string;
  allowedFileTypes: string[];
  maxFileSize: number;
  domains: string[];
  event: { name: string; slug: string };
}

export interface SubmissionFormData {
  teamId: string;
  leaderEmail: string;
  leaderContact: string;
  domain: string;
  problemStatement: string;
  solutionSummary: string;
}

export interface SubmissionResponse {
  submissionId: string;
  teamName: string;
  submittedAt: string;
}

export interface SubmissionDetail {
  id: string;
  submissionId: string;
  teamId: string;
  team: { teamName: string };
  leaderEmail: string;
  leaderContact: string;
  domain: string;
  problemStatement: string;
  solutionSummary: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: string;
  submittedAt: string;
}

export interface AdminStats {
  total: number;
  pdf: number;
  pptx: number;
  today: number;
  byDomain: { domain: string; count: number }[];
  byStatus: { status: string; count: number }[];
}

export interface PaginatedSubmissions {
  submissions: SubmissionDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicSubmissionDetail {
  submissionId: string;
  teamName: string;
  submittedAt: string;
  status: string;
}
