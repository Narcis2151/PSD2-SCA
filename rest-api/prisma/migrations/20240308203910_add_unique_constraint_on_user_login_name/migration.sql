-- CreateEnum
CREATE TYPE "Source" AS ENUM ('PSU', 'TPP');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('BOOKED', 'PENDING');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "iban" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "partyId" INTEGER,
    "name" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "balanceType" TEXT NOT NULL,
    "lastChange" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "partyId" INTEGER,
    "userId" INTEGER,
    "tppRedirectUrl" TEXT,
    "tppApplicationId" INTEGER,
    "psuId" TEXT NOT NULL,
    "isRecurrent" BOOLEAN,
    "frequencyPerDay" INTEGER,
    "isActive" BOOLEAN,
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "allAccountsAccess" BOOLEAN,
    "psuIpAddress" TEXT,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentAccount" (
    "id" SERIAL NOT NULL,
    "consentId" INTEGER NOT NULL,
    "accountId" INTEGER,
    "isTransactionsAccess" BOOLEAN,
    "isBalancesAccess" BOOLEAN,
    "source" "Source",
    "iban" TEXT NOT NULL,

    CONSTRAINT "ConsentAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentAction" (
    "id" SERIAL NOT NULL,
    "consentId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tpp" (
    "id" SERIAL NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "addressCountry" TEXT,
    "addressTown" TEXT,
    "addressPostalCode" TEXT,
    "hasPispPermission" BOOLEAN NOT NULL,
    "hasPiispPermission" BOOLEAN NOT NULL,
    "hasAispPermission" BOOLEAN NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Tpp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TppApplication" (
    "id" SERIAL NOT NULL,
    "applicationName" TEXT NOT NULL,
    "redirectUrl" TEXT NOT NULL,
    "tppId" INTEGER NOT NULL,

    CONSTRAINT "TppApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "resourceId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "valueDate" TIMESTAMP(3) NOT NULL,
    "creditor" TEXT NOT NULL,
    "debtor" TEXT NOT NULL,
    "creditorAccount" TEXT NOT NULL,
    "debtorAccount" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accountId" INTEGER,
    "status" "TransactionStatus" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "loginName" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserParty" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "partyId" INTEGER NOT NULL,

    CONSTRAINT "UserParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPartyAccount" (
    "id" SERIAL NOT NULL,
    "userPartyId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "UserPartyAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_iban_key" ON "Account"("iban");

-- CreateIndex
CREATE UNIQUE INDEX "Account_resourceId_key" ON "Account"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Consent_psuId_key" ON "Consent"("psuId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_resourceId_key" ON "Transaction"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_loginName_key" ON "User"("loginName");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_tppApplicationId_fkey" FOREIGN KEY ("tppApplicationId") REFERENCES "TppApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentAccount" ADD CONSTRAINT "ConsentAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentAccount" ADD CONSTRAINT "ConsentAccount_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "Consent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentAction" ADD CONSTRAINT "ConsentAction_consentId_fkey" FOREIGN KEY ("consentId") REFERENCES "Consent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TppApplication" ADD CONSTRAINT "TppApplication_tppId_fkey" FOREIGN KEY ("tppId") REFERENCES "Tpp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParty" ADD CONSTRAINT "UserParty_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParty" ADD CONSTRAINT "UserParty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPartyAccount" ADD CONSTRAINT "UserPartyAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPartyAccount" ADD CONSTRAINT "UserPartyAccount_userPartyId_fkey" FOREIGN KEY ("userPartyId") REFERENCES "UserParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
