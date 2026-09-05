import { Request, Response, NextFunction } from 'express';
import { getActiveRound, checkDeadline, validateTeam, checkDuplicate, createSubmission as doCreateSubmission } from '../services/submission.service';
import { validateFileMagicBytes } from '../utils/fileValidation';
import { sendConfirmationEmail } from '../services/email.service';
import { fullSubmissionSchema } from '../schemas/submission.schema';
import { prisma } from '../config/prisma';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const eventSlug = 'codemerge-v2';
    const roundSlug = 'ppt-round-1';

    const round = await getActiveRound(eventSlug, roundSlug);
    checkDeadline(round);

    // Validate body fields with Zod
    const parsed = fullSubmissionSchema.parse(req.body);
    const { teamId, leaderEmail, leaderContact, domain, problemStatement, solutionSummary } = parsed;

    if (!req.file) {
      return res.status(400).json({ error: 'Presentation file is required.' });
    }

    const fileMagic = validateFileMagicBytes(req.file.buffer);
    if (!fileMagic.valid) {
      return res.status(400).json({ error: 'Invalid file content.' });
    }

    const team = await validateTeam(teamId, round.eventId);
    await checkDuplicate(teamId, round.id);

    const result = await doCreateSubmission({
      roundId: round.id,
      teamId: team.id,
      teamName: team.teamName,
      leaderEmail,
      leaderContact,
      domain,
      problemStatement,
      solutionSummary,
      fileName: req.file.originalname,
      fileType: fileMagic.detectedType!,
      fileSize: req.file.size,
      fileBuffer: req.file.buffer
    });

    sendConfirmationEmail({
      to: leaderEmail,
      teamName: team.teamName,
      submissionId: result.submissionId,
      submittedAt: result.submittedAt
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBySubmissionId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { submissionId } = req.params;
    const submission = await prisma.submission.findFirst({
      where: { submissionId },
      include: { team: true }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    res.json({
      submissionId: submission.submissionId,
      teamName: submission.team.teamName,
      submittedAt: submission.submittedAt,
      status: submission.status
    });
  } catch (error) {
    next(error);
  }
};
