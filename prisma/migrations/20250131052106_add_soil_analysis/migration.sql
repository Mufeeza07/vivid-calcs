-- CreateTable
CREATE TABLE "SoilAnalysis" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "shrinkageIndex" DOUBLE PRECISION NOT NULL,
    "lateralRestraint" DOUBLE PRECISION NOT NULL,
    "suctionChange" DOUBLE PRECISION NOT NULL,
    "layerThickness" DOUBLE PRECISION NOT NULL,
    "instabilityIndex" DOUBLE PRECISION NOT NULL,
    "surfaceMovement" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoilAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SoilAnalysis" ADD CONSTRAINT "SoilAnalysis_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;
