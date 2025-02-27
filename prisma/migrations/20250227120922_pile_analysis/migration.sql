/*
  Warnings:

  - You are about to drop the `PileSlabAnalysis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PileSlabAnalysis" DROP CONSTRAINT "PileSlabAnalysis_jobId_fkey";

-- AlterTable
ALTER TABLE "BeamSlabAnalysis" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "BoltStrength" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "SoilAnalysis" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "Weld" ADD COLUMN     "note" TEXT;

-- DropTable
DROP TABLE "PileSlabAnalysis";

-- CreateTable
CREATE TABLE "PileAnalysis" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "note" TEXT,
    "type" "Type" NOT NULL,
    "frictionAngle" DOUBLE PRECISION NOT NULL,
    "safetyFactor" DOUBLE PRECISION NOT NULL,
    "ks" DOUBLE PRECISION NOT NULL,
    "soilDensity" DOUBLE PRECISION NOT NULL,
    "pileHeight" DOUBLE PRECISION NOT NULL,
    "factor" DOUBLE PRECISION NOT NULL,
    "pileDiameter" DOUBLE PRECISION NOT NULL,
    "frictionResistanceAS" DOUBLE PRECISION NOT NULL,
    "frictionResistanceMH" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "cohension" DOUBLE PRECISION NOT NULL,
    "nq" DOUBLE PRECISION NOT NULL,
    "nc" DOUBLE PRECISION NOT NULL,
    "reductionStrength" DOUBLE PRECISION NOT NULL,
    "endBearing" DOUBLE PRECISION NOT NULL,
    "totalUpliftResistance" DOUBLE PRECISION NOT NULL,
    "totalPileCapacityAS" DOUBLE PRECISION NOT NULL,
    "totalPileCapacityMH" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PileAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PileAnalysis" ADD CONSTRAINT "PileAnalysis_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;
