import { Router } from 'express';
import { create, getBySubmissionId } from '../controllers/submission.controller';
import { upload } from '../middleware/upload';
import { submissionLimiter } from '../middleware/rateLimiter';

const router = Router();
router.post('/', submissionLimiter, upload, create);
router.get('/:submissionId', getBySubmissionId);
export default router;
