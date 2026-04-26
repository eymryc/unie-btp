-- AlterTable
ALTER TABLE "Company" ADD COLUMN "availability" TEXT;
ALTER TABLE "Company" ADD COLUMN "availabilityNote" TEXT;
ALTER TABLE "Company" ADD COLUMN "references" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "submittedAt" DATETIME;

-- CreateTable
CREATE TABLE "CompanyDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompanyDocument_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccompagnementRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AccompagnementRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OpportunityInterest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'INTERESTED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OpportunityInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OpportunityInterest_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OpportunityInterest" ("createdAt", "id", "opportunityId", "userId") SELECT "createdAt", "id", "opportunityId", "userId" FROM "OpportunityInterest";
DROP TABLE "OpportunityInterest";
ALTER TABLE "new_OpportunityInterest" RENAME TO "OpportunityInterest";
CREATE UNIQUE INDEX "OpportunityInterest_userId_opportunityId_key" ON "OpportunityInterest"("userId", "opportunityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
