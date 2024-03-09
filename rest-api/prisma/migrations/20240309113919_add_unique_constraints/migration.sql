/*
  Warnings:

  - A unique constraint covering the columns `[userId,partyId]` on the table `UserParty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userPartyId,accountId]` on the table `UserPartyAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserParty_userId_partyId_key" ON "UserParty"("userId", "partyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPartyAccount_userPartyId_accountId_key" ON "UserPartyAccount"("userPartyId", "accountId");
