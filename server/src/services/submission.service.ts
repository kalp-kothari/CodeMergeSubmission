import { prisma } from '../config/prisma';
import { generateSubmissionId } from '../utils/idGenerator';
import { uploadFile, deleteFile } from './storage.service';

export const getActiveRound = async (eventSlug: string, roundSlug: string) => {
  const round = await prisma.round.findFirst({
    where: {
      slug: roundSlug,
      event: {
        slug: eventSlug
      }
    },
    include: {
      event: true
    }
  });

  if (!round) {
    throw new Error('Round not found');
  }

  return round;
};

export const getEligibleTeams = async (eventSlug: string) => {
  const teams = await prisma.team.findMany({
    where: {
      isEligible: true,
      event: {
        slug: eventSlug
      }
    },
    select: {
      id: true,
      teamName: true
    }
  });

  return teams;
};

export const checkDeadline = (round: { submissionDeadline: Date }) => {
  if (new Date() > round.submissionDeadline) {
    const error: any = new Error('Submission deadline has passed');
    error.code = 'DEADLINE_PASSED';
    throw error;
  }
};

export const checkDuplicate = async (teamId: string, roundId: string) => {
  const existing = await prisma.submission.findFirst({
    where: {
      teamId,
      roundId
    }
  });

  if (existing) {
    const error: any = new Error('Submission already exists');
    error.code = 'DUPLICATE_SUBMISSION';
    throw error;
  }
};

export const validateTeam = async (teamId: string, eventId: string) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      eventId
    }
  });

  if (!team) {
    const error: any = new Error('Team not found for this event');
    error.code = 'TEAM_NOT_FOUND';
    throw error;
  }

  if (!team.isEligible) {
    const error: any = new Error('Team is not eligible to submit');
    error.code = 'TEAM_NOT_ELIGIBLE';
    throw error;
  }

  return team;
};

export const createSubmission = async (data: {
  roundId: string;
  teamId: string;
  teamName: string;
  leaderEmail: string;
  leaderContact: string;
  domain: string;
  problemStatement: string;
  solutionSummary: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileBuffer: Buffer;
}) => {
  const lastSubmission = await prisma.submission.findFirst({
  where: { roundId: data.roundId },
  orderBy: { sequenceNumber: 'desc' },
  select: { sequenceNumber: true }
});

const seq = (lastSubmission?.sequenceNumber ?? 0) + 1;
const submissionId = generateSubmissionId(seq);
const extension = data.fileType === 'pdf' ? 'pdf' : 'pptx';
const storagePath = `codemerge-v2/round-1/${submissionId}/presentation.${extension}`;

  // Upload to Supabase
  const uploadedPath = await uploadFile(storagePath, data.fileBuffer, data.fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

  try {
    const submission = await prisma.submission.create({
      data: {
        submissionId,
        sequenceNumber: seq,
        roundId: data.roundId,
        teamId: data.teamId,
        leaderEmail: data.leaderEmail,
        leaderContact: data.leaderContact,
        domain: data.domain,
        problemStatement: data.problemStatement,
        solutionSummary: data.solutionSummary,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        storagePath: uploadedPath,
        status: 'SUBMITTED',
      }
    });

    return {
      submissionId: submission.submissionId,
      teamName: data.teamName,
      submittedAt: submission.submittedAt
    };
  } catch (err: any) {
    await deleteFile(uploadedPath); // Cleanup
    throw err;
  }
};
