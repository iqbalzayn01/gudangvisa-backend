import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository.js';
import { AppError } from '../../utils/AppError.js';

export class UsersService {
  private repository = new UsersRepository();

  async createNewStaff(data: any) {
    // 1. Check if the email already exists
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(
        400,
        'Email is already registered. Please use another email.',
      );
    }

    // 2. Hash the password for security (Standard Industry Practice)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // 3. Prepare the safe data to save
    const newUserData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'STAFF', // Default to STAFF if not provided
    };

    // 4. Save to database
    return await this.repository.createUser(newUserData);
  }

  async getAllStaff() {
    return await this.repository.findAllUsers();
  }

  async removeStaff(userId: string) {
    return await this.repository.deleteUserById(userId);
  }
}
