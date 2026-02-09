import { Router } from 'express';
import { StartupController } from '../controllers/startup.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const startupController = new StartupController();

router.get('/talent', authenticate, startupController.getTalentFeed.bind(startupController));
router.get('/teams', authenticate, startupController.getPrimeTeams.bind(startupController));
router.post('/jobs', authenticate, startupController.createJobPosting.bind(startupController));

export default router;
