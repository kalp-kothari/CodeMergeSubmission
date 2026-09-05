import { Router } from 'express';
import {
  getEligibleTeams,
  verifyTeamLeader,
} from '../controllers/team.controller';

const router = Router();

router.get('/', getEligibleTeams);
router.post('/verify', verifyTeamLeader);

export default router;