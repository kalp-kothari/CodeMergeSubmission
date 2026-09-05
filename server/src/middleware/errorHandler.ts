import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): any => {
  logger.error(err.message, err);

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'This team has already submitted its presentation.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' });
  }
  if (err.message === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File exceeds the 10 MB size limit.' });
  }
  if (err.message === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Invalid file upload.' });
  }
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map(e => ({ path: e.path.join('.'), message: e.message }));
    return res.status(400).json({ error: 'Validation failed', details: fieldErrors });
  }
  
  if (err.code === 'DEADLINE_PASSED') {
    return res.status(403).json({ error: 'Submission deadline has passed.' });
  }
  if (err.code === 'DUPLICATE_SUBMISSION') {
    return res.status(409).json({ error: 'This team has already submitted its presentation.' });
  }
  if (err.code === 'TEAM_NOT_FOUND' || err.code === 'TEAM_NOT_ELIGIBLE') {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
};
