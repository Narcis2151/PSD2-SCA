import { PrismaClient } from '@prisma/client';
import { SubmitConsentInput } from '../schemas/consent.schema';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export async function validateConsent(consentId: number) {
  try {
    const consent = await prisma.consent.findUnique({
      where: { id: consentId, status: 'PENDING', isActive: true },
    });

    if (!consent) {
      throw new Error('Consent not found');
    }

    return consent;
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e.message);
  }
}

export async function getConsent(consentId: number) {
  try {
    const consent = await prisma.consent.findUnique({
      where: { id: consentId, status: 'PENDING', isActive: true },
      include: {
        ConsentAccounts: true,
      },
    });

    if (!consent?.userId || !consent?.partyId) {
      throw new Error('Consent not found');
    }

    if (consent) {
      const userParty = await prisma.userParty.findUnique({
        where: {
          userId_partyId: {
            userId: consent.userId,
            partyId: consent.partyId,
          },
        },
      });
      if (!userParty) {
        throw new Error('User party not found');
      }
      const userPartyAccounts = await prisma.userPartyAccount.findMany({
        where: {
          userPartyId: userParty.id,
        },
      });
      let accounts = await prisma.account.findMany({
        where: {
          id: {
            in: userPartyAccounts.map((account) => account.accountId),
          },
        },
      });
      if (consent.allAccountsAccess) {
        accounts = accounts.map((account) => {
          return {
            ...account,
            isEditable: true,
            isBalancesAccount: true,
            isTransactionsAccount: true,
          };
        });
      } else {
        accounts = accounts
          .filter((account) => {
            return consent.ConsentAccounts.find(
              (id) => id.accountId === account.id
            );
          })
          .map((account) => {
            return {
              ...account,
              isEditable: false,
              isBalancesAccount:
                consent.ConsentAccounts.find(
                  (id) => id.accountId === account.id
                )?.isBalancesAccess || false,
              isTransactionsAccount:
                consent.ConsentAccounts.find(
                  (id) => id.accountId === account.id
                )?.isTransactionsAccess || false,
            };
          });
      }
      return {
        accounts: accounts,
        validTo: consent.validTo,
        isRecurrent: consent.isRecurrent,
      };
    }
    return consent;
  } catch (e: any) {
    logger.error(e.message);
    throw new Error(e.message);
  }
}

export async function submitConsent(
  consentId: number,
  consentData: SubmitConsentInput['body']
) {
  try {
    const consent = await prisma.consent.update({
      where: { id: consentId, status: 'PENDING', isActive: true },
      data: {
        status: 'VALID',
        validTo: consentData.validTo,
        ConsentAccounts: {
          connect: consentData.accounts.map((account) => {
            return {
              id: account.accountId,
              isBalancesAccess: account.isBalancesAccount,
              isTransactionsAccess: account.isTransactionsAccount,
            };
          }),
        },
      },
    });

    return consent.tppRedirectUrl;
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

export async function postParty(consentId: number, partyId: number) {
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
