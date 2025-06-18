import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import config from '../../src/config';

const prisma = new PrismaClient();

export async function seedUsers() {
  
  const defaultPassword = await bcrypt.hash(
      "123456" as string,
      Number(config.jwt.bcrypt_salt_rounds) || 10,
    );

  const users = [
    {
      name: 'Demo Softograph',
      email: 'demo@softograph.com',
      phoneNumber: '+1234567890',
      password: defaultPassword,
      isVerified: true,
      role: UserRole.admin
    },
    {
      name: 'Amanullah Aman',
      email: 'aman@softograph.com',
      phoneNumber: '+1234567890',
      password: defaultPassword,
      isVerified: true,
      role: UserRole.admin
    },
    {
      name: 'Sheikh Arman',
      email: 'sheikharman@softograph.com',
      phoneNumber: '+1234567890',
      password: defaultPassword,
      isVerified: true,
      role: UserRole.admin
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      password: defaultPassword,
      isVerified: true,
      role: UserRole.user,
      detail: {
        create: {
          address: '123 Main St',
          city: 'New York',
          road: 'Broadway'
        }
      }
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+1234567891',
      password: defaultPassword,
      isVerified: true,
      role: UserRole.user,
      detail: {
        create: {
          address: '456 Oak Ave',
          city: 'Los Angeles',
          road: 'Sunset Blvd'
        }
      }
    }
    
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }

  console.log('Users seeded successfully');
}