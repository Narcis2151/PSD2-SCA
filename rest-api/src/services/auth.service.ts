import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function loginUser(loginName: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { loginName } });

    if (!user) {
      throw new Error('User or password incorrect');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('User or password incorrect');
    }
    return user;
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e.message);
  }
}
