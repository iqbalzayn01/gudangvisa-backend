import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'rahasia',
);

export const loginStaff = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = result[0];

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // Membuat Token pakai JOSE
    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
      name: user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h') // Token berlaku 8 Jam untuk 1 shift kerja staff
      .sign(JWT_SECRET);

    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
};
