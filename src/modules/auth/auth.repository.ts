import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';

export class AuthRepository {
  async findByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }
}
