import { Router } from 'express';
import { RequestController } from '../controllers/request.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const requestController = new RequestController();

router.post('/', authenticate, requestController.createRequest.bind(requestController));
router.get('/notifications', authenticate, requestController.getMyNotifications.bind(requestController));

export default router;
