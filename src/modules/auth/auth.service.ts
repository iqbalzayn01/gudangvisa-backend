import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { AuthRepository } from './auth.repository';
import { ENV } from '../../config/env';

export class AuthService {
  private repository = new AuthRepository();
  private secretKey = new TextEncoder().encode(ENV.JWT_SECRET);

  async login(email: string, pass: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = await new SignJWT({ id: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(this.secretKey);

    return { user: { id: user.id, name: user.name, role: user.role }, token };
  }
}
