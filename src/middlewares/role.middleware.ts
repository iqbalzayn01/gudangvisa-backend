import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware to restrict access based on user roles.
 * @param allowedRoles Array of allowed roles (example: ['ADMIN', 'STAFF'])
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure the user is authenticated first
    if (!req.user) {
      return next(new AppError(401, 'Authentication required.'));
    }

    // Check if the user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          'Access denied: You do not have permission to perform this action.',
        ),
      );
    }

    // Role is allowed, continue
    next();
  };
};
