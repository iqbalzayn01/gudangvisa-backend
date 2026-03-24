import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'rahasia',
);

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Akses ditolak. Token tidak ditemukan.' });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    // Menyimpan data user dari token ke dalam request object
    (req as any).user = payload;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: 'Token tidak valid atau kedaluwarsa.' });
  }
};
