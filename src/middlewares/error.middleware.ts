import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ENV } from '../config/env';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Jika error adalah instance dari AppError (Error yang kita buat sengaja)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Jika error BUKAN dari AppError (Berarti ini Bug, Database down, atau Syntax Error)
  // Kita log error-nya ke console (atau ke log monitoring seperti Sentry)
  console.error('💥 UNEXPECTED ERROR:', err);

  // Jangan pernah membocorkan detail error teknis ke user/client di tahap Production
  const message =
    ENV.NODE_ENV === 'development'
      ? err.message
      : 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';

  res.status(500).json({
    success: false,
    message: message,
  });
};
