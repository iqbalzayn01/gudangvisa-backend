import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import { AppError } from '../../utils/AppError';

export class UsersRepository {
  // 1. Check if an email is already registered
  async findByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  // 2. Create a new user (Staff/Admin)
  async createUser(data: typeof users.$inferInsert) {
    const [newUser] = await db.insert(users).values(data).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    });

    if (!newUser) {
      throw new AppError(500, 'Database failed to create a new user.');
    }

    return newUser;
  }

  // 3. Get all users (Without passwords!)
  async findAllUsers() {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users);
  }

  // 4. Delete a user by ID
  async deleteUserById(id: string) {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!deletedUser) {
      throw new AppError(404, 'User not found or already deleted.');
    }

    return true;
  }
}
