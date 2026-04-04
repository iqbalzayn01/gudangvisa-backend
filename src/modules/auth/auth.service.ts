import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { AuthRepository } from './auth.repository';
import { ENV } from '../../config/env';
import { JwtPayloadData } from '../../types';
import { AppError } from '../../utils/AppError';

export class AuthService {
  private repository = new AuthRepository();
  private secretKey = new TextEncoder().encode(ENV.JWT_SECRET);

  async login(email: string, pass: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new AppError(401, 'Invalid credentials');

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new AppError(401, 'Invalid credentials');

    const payload: JwtPayloadData = {
      id: user.id,
      role: user.role,
    };

    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(this.secretKey);

    return {
      user: { name: user.name, role: user.role },
      token,
    };
  }
}
