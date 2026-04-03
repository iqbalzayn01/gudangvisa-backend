import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { ENV } from '../config/env';
import { AppError } from '../utils/AppError';

// Mendeklarasikan tipe data User agar TypeScript tidak error saat kita memanggil req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Ambil token dari header 'Authorization: Bearer <token>'
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        401,
        'Anda belum login. Silakan login untuk mendapatkan akses.',
      );
    }

    const token = authHeader.split(' ')[1];

    // 2. Verifikasi token menggunakan secret key
    const secretKey = new TextEncoder().encode(ENV.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);

    // 3. Masukkan payload (id, role) ke dalam object request
    req.user = {
      id: payload.id as string,
      role: payload.role as string,
    };

    // 4. Lanjut ke proses berikutnya (controller / middleware lain)
    next();
  } catch (error) {
    // Jika token kedaluwarsa atau tidak valid
    next(
      new AppError(
        401,
        'Token tidak valid atau sudah kedaluwarsa. Silakan login kembali.',
      ),
    );
  }
};
