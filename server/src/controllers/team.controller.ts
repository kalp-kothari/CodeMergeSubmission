import { Request, Response, NextFunction } from 'express';
import { getEligibleTeams as fetchEligibleTeams } from '../services/submission.service';

export const getEligibleTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventSlug = (req.query.eventSlug as string) || 'codemerge-v2';
    const teams = await fetchEligibleTeams(eventSlug);
    res.json(teams);
  } catch (error) {
    next(error);
  }
};
