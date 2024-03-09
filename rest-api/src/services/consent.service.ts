import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export async function getConsent(consentId: number) {
  try {
    const consent = await prisma.consent.findUnique({
      where: { id: consentId, status: 'PENDING', isActive: true },
    });

    return consent;
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e.message);
  }
}

export async function addConsentUser(consentId: number, userId: number) {
  try {
    const consent = await prisma.consent.update({
      where: { id: consentId, status: 'PENDING', isActive: true },
      data: {
        userId: userId,
      },
    });

    return consent;
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e.message);
  }
}

export async function postParty(consentId: number, partyId: any) {
  try {
    const consent = await prisma.consent.update({
      where: { id: consentId, status: 'PENDING', isActive: true },
      data: {
        partyId: partyId,
      },
    });

    return consent;
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e.message);
  }
}
