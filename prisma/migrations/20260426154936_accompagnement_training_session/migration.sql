-- AlterTable
ALTER TABLE "AccompagnementRequest" ADD COLUMN     "trainingSessionId" TEXT;

-- AddForeignKey
ALTER TABLE "AccompagnementRequest" ADD CONSTRAINT "AccompagnementRequest_trainingSessionId_fkey" FOREIGN KEY ("trainingSessionId") REFERENCES "TrainingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
