import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Middleware untuk membatasi akses berdasarkan Role.
 * @param allowedRoles Array dari role yang diizinkan (contoh: ['ADMIN', 'STAFF'])
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Pastikan requireAuth sudah dijalankan sebelumnya sehingga req.user ada
    if (!req.user) {
      return next(new AppError(401, 'Autentikasi diperlukan.'));
    }

    // Jika role user saat ini tidak ada di daftar allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          'Akses ditolak: Anda tidak memiliki izin untuk melakukan aksi ini.',
        ),
      );
    }

    next();
  };
};
