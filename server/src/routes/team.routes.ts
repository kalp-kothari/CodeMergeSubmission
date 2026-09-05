import { Router } from 'express';
import { getEligibleTeams } from '../controllers/team.controller';
const router = Router();
router.get('/', getEligibleTeams);
export default router;
