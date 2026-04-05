import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

const router = Router();
const controller = new UsersController();

// PROTECT ALL ROUTES: Only logged-in users with the 'ADMIN' role can access these routes!
router.use(requireAuth);
router.use(authorizeRoles('ADMIN'));

// Routes
router.get('/me', controller.getMe);
router.post('/', controller.createStaff);
router.get('/', controller.getAllStaff);
router.delete('/:id', controller.deleteStaff);

export default router;
