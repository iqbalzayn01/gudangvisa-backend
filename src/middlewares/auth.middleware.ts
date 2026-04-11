import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { JwtPayloadData } from '../types/index.js';

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Get the token from the 'Authorization' header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        401,
        'You are not logged in. Please log in to get access.',
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(
        401,
        'Token is missing. Please provide a valid token.',
      );
    }

    // 2. Verify the token using the secret key
    const secretKey = new TextEncoder().encode(ENV.JWT_SECRET);
    const { payload } = await jwtVerify(token, secretKey);

    const decoded = payload as unknown as JwtPayloadData;

    // 3. Attach the user data to the request object
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    // 4. Move to the next process (controller)
    next();
  } catch (error) {
    next(new AppError(401, 'Invalid or expired token. Please log in again.'));
  }
};
