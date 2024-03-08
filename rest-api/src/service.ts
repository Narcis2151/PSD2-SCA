import { PrismaClient } from '@prisma/client';

export async function loginUser() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst();
  prisma.$disconnect();
  return user;
}
