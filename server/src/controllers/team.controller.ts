import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { getEligibleTeams as fetchEligibleTeams } from '../services/submission.service';

export const getEligibleTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventSlug = (req.query.eventSlug as string) || 'codemerge-v2';
    const teams = await fetchEligibleTeams(eventSlug);
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

export const verifyTeamLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teamId, leaderEmail } = req.body;

    if (!teamId || !leaderEmail) {
      return res.status(400).json({
        verified: false,
        error: 'Team details could not be verified.',
      });
    }

    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
      select: {
        leaderEmail: true,
      },
    });

    if (!team || !team.leaderEmail) {
      return res.status(403).json({
        verified: false,
        error: 'Team details could not be verified.',
      });
    }

    const verified =
      team.leaderEmail.trim().toLowerCase() ===
      leaderEmail.trim().toLowerCase();

    if (!verified) {
      return res.status(403).json({
        verified: false,
        error: 'Team details could not be verified.',
      });
    }

    return res.json({
      verified: true,
    });
  } catch (error) {
    next(error);
  }
};