import { Router } from 'express';
import { listSubmissions, getSubmissionById, downloadFile, updateStatus, getStats, exportExcel } from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.get('/submissions', listSubmissions);
router.get('/stats', getStats);
router.get('/export', exportExcel);
router.get('/submissions/:id', getSubmissionById);
router.get('/submissions/:id/download', downloadFile);
router.patch('/submissions/:id/status', updateStatus);
export default router;
