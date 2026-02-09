import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const teamController = new TeamController();

router.post('/', authenticate, teamController.createTeam.bind(teamController));
router.get('/feed', authenticate, teamController.getTeamFeed.bind(teamController));

export default router;
