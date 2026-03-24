import { Router } from 'express';
import { loginStaff } from '../controller/authController';
import {
  uploadDocument,
  trackDocument,
} from '../controller/documentController';
import { verifyToken } from '../middlewares/auth';
import { uploadDoc } from '../middlewares/upload';

const router = Router();

// Endpoint Auth
router.post('/auth/login', loginStaff);

// Endpoint Client / Public (Tracking)
router.get('/track/:trackingNumber', trackDocument);

// Endpoint Staff Internal (Dilindungi JWT)
// Menggunakan uploadDoc.single('document') artinya key form-data harus bernama "document"
router.post(
  '/staff/documents',
  verifyToken,
  uploadDoc.single('document'),
  uploadDocument,
);

export default router;
