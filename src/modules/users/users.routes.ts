import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';

const router = Router();
const controller = new UsersController();

// PROTECT ALL ROUTES: Only logged-in users with the 'ADMIN' role can access these routes!
router.use(requireAuth);
router.use(authorizeRoles('ADMIN'));

// Routes
router.post('/', controller.createStaff);
router.get('/', controller.getAllStaff);
router.delete('/:id', controller.deleteStaff);

export default router;
