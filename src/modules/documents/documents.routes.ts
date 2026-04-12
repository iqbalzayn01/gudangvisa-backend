import { Router } from 'express';
import { DocumentController } from './documents.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

const router = Router();
const controller = new DocumentController();

// 1. PUBLIC ROUTE: Clients can track documents without logging in
router.get('/track/:trackingCode', controller.trackDocument);

// 2. PROTECTED ROUTE: Generate a signed upload URL for direct-to-storage upload
router.post(
  '/upload-url',
  requireAuth,
  authorizeRoles('STAFF', 'ADMIN'),
  controller.getUploadUrl,
);

// 3. PROTECTED ROUTE: Create a new document (after file has been uploaded to storage)
router.post(
  '/',
  requireAuth,
  authorizeRoles('STAFF', 'ADMIN'),
  controller.createDocument,
);

// 4. PROTECTED ROUTE: Only STAFF and ADMIN can update document status
router.patch(
  '/:id/status',
  requireAuth,
  authorizeRoles('STAFF', 'ADMIN'),
  controller.updateStatus,
);

export default router;
