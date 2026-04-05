import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ENV } from '../config/env.js';

export const globalErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // If the error is a known AppError (like "Document not found")
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // If the error is unexpected (like a database crash or code bug)
  console.error('UNEXPECTED ERROR:', err);

  // In production, do not leak technical details to the client
  const message =
    ENV.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong on the server. Please try again later.';

  res.status(500).json({
    success: false,
    message: message,
  });
};
