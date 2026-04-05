import { Router } from 'express';
import { DocumentController } from './documents.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';
import { uploadMiddleware } from '../../middlewares/upload.middleware.js';

const router = Router();
const controller = new DocumentController();

// 1. PUBLIC ROUTE: Clients can track documents without logging in
router.get('/track/:trackingCode', controller.trackDocument);

// 2. PROTECTED ROUTE: Only STAFF and ADMIN can create new documents
// 'documentFile' is the form-data key the frontend will use to upload the PDF/Image
router.post(
  '/',
  requireAuth,
  authorizeRoles('STAFF', 'ADMIN'),
  uploadMiddleware.single('documentFile'),
  controller.createDocument,
);

// 3. PROTECTED ROUTE: Only STAFF and ADMIN can update document status
router.patch(
  '/:id/status',
  requireAuth,
  authorizeRoles('STAFF', 'ADMIN'),
  controller.updateStatus,
);

export default router;
