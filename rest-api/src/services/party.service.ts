import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export default async function getParties(userId: number) {
  try {
    const parties = await prisma.party.findMany({
      where: {
        UserParty: {
          some: {
            userId,
          },
        },
      },
    });

    return parties;
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e.message);
  }
}


