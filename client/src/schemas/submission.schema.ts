import { z } from 'zod';

export const teamDetailsSchema = z.object({
  teamId: z.string().min(1, 'Please select a team'),
  leaderEmail: z.string().email('Please enter a valid email address').transform(v => v.toLowerCase().trim()),
  leaderContact: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

export const submissionDetailsSchema = z.object({
  domain: z.string().min(1, 'Please select a domain'),
  problemStatement: z.string().min(1, 'Problem statement is required').max(1000, 'Maximum 1000 characters'),
  solutionSummary: z.string().min(1, 'Solution summary is required').max(750, 'Maximum 750 characters'),
});

export const fullSubmissionSchema = teamDetailsSchema.merge(submissionDetailsSchema);
export type FullSubmissionData = z.infer<typeof fullSubmissionSchema>;
