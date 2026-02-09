import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const eventController = new EventController();

router.get('/', eventController.getEvents.bind(eventController));
router.post('/register', authenticate, eventController.registerForEvent.bind(eventController));

export default router;
