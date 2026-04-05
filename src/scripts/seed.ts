import bcrypt from 'bcrypt';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

async function runSeed() {
  console.log('🌱 Starting the database seeding process...');

  try {
    // Check if the admin account already exists
    const existingSuperAdmin = await db.query.users.findFirst({
      where: eq(users.email, 'admin@gudangvisa.com'),
    });

    if (existingSuperAdmin) {
      console.log('⚠️ Admin account already exists! No new data was added.');
      process.exit(0);
    }
    // Hash the default password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert data into the database
    await db.insert(users).values({
      name: 'Super Admin',
      email: 'admin@gudangvisa.com',
      password: hashedPassword,
      role: 'ADMIN',
    });

    console.log('✅ First Admin account created successfully!');
    console.log('📧 Email: admin@gudangvisa.com');
    console.log('🔑 Password: admin123');
    process.exit(0); // Exit the script after completion
  } catch (error) {
    console.error('❌ Failed to seed the database:', error);
    process.exit(1); // Exit with an error code
  }
}

runSeed();
