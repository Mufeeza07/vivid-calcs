-- CreateTable
CREATE TABLE "SteelBeam" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "beamSpan" DOUBLE PRECISION NOT NULL,
    "floorLoadWidth" DOUBLE PRECISION NOT NULL,
    "roofLoadWidth" DOUBLE PRECISION NOT NULL,
    "wallHeight" DOUBLE PRECISION NOT NULL,
    "pointFloorLoadArea" DOUBLE PRECISION NOT NULL,
    "pointRoofLoadArea" DOUBLE PRECISION NOT NULL,
    "floorDeadLoad" DOUBLE PRECISION NOT NULL,
    "roofDeadLoad" DOUBLE PRECISION NOT NULL,
    "floorLiveLoad" DOUBLE PRECISION NOT NULL,
    "wallLoad" DOUBLE PRECISION NOT NULL,
    "steelUDLWeight" DOUBLE PRECISION NOT NULL,
    "steelPointWeight" DOUBLE PRECISION NOT NULL,
    "udlDeadLoad" DOUBLE PRECISION NOT NULL,
    "udlLiveLoad" DOUBLE PRECISION NOT NULL,
    "udlServiceLoad" DOUBLE PRECISION NOT NULL,
    "pointDeadLoad" DOUBLE PRECISION NOT NULL,
    "pointLiveLoad" DOUBLE PRECISION NOT NULL,
    "pointServiceLoad" DOUBLE PRECISION NOT NULL,
    "deflectionLimit" DOUBLE PRECISION NOT NULL,
    "momentOfInertia" DOUBLE PRECISION NOT NULL,
    "moment" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SteelBeam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SteelBeam" ADD CONSTRAINT "SteelBeam_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;
