import { Router } from 'express';
import { TrackingController } from './tracking.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new TrackingController();

// Public route for clients
router.get('/:code', controller.trackByCode);

// Protected route for staff
router.patch('/:id/status', requireAuth, controller.updateStatus);

export default router;
