import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

const router = Router();
const controller = new UsersController();

router.use(requireAuth);

router.get('/me', authorizeRoles('ADMIN', 'STAFF'), controller.getMe);

// PROTECT ALL ROUTES: Only logged-in users with the 'ADMIN' role can access these routes!
router.use(authorizeRoles('ADMIN'));

router.post('/', controller.createStaff);
router.get('/', controller.getAllStaff);
router.delete('/:id', controller.deleteStaff);

export default router;
