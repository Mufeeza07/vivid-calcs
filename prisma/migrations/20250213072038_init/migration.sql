-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('STEEL_TO_STEEL', 'TIMBER_TO_TIMBER', 'TIMBER_TO_STEEL');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('AFFECTED_AREA_LESS_25M2', 'AFFECTED_AREA_GREATER_25M2', 'POST_DISASTER_BUILDING');

-- CreateEnum
CREATE TYPE "ScrewType" AS ENUM ('SHEAR', 'UPLIFT');

-- CreateEnum
CREATE TYPE "ScrewSize" AS ENUM ('SIZE_4', 'SIZE_6', 'SIZE_8', 'SIZE_10', 'SIZE_12', 'SIZE_14', 'SIZE_18');

-- CreateEnum
CREATE TYPE "JDType" AS ENUM ('JD1', 'JD2', 'JD3', 'JD4', 'JD5', 'JD6');

-- CreateEnum
CREATE TYPE "Load" AS ENUM ('PARALLEL_TO_GRAINS', 'PERPENDICULAR_TO_GRAINS');

-- CreateEnum
CREATE TYPE "LoadType" AS ENUM ('PERMANENT_ACTION', 'ROOF_LIVE_LOAD_DISTRIBUTED', 'ROOF_LIVE_LOAD_CONCENTRATED', 'FLOOR_LIVE_LOADS_DISTRIBUTED', 'FLOOR_LIVE_LOADS_CONCENTRATED', 'PERMANENT_LONG_TERM_IMPOSED_ACTION', 'PERMANENT_WIND_IMPOSED_ACTION', 'PERMANENT_WIND_ACTION_REVERSAL', 'PERMANENT_EARTHQUAKE_IMPOSED_ACTION', 'FIRE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "jobId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "windSpeed" TEXT NOT NULL,
    "locationFromCoastline" TEXT NOT NULL,
    "councilName" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jobId")
);

-- CreateTable
CREATE TABLE "Nails" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "k13" DOUBLE PRECISION NOT NULL,
    "diameter" DOUBLE PRECISION NOT NULL,
    "screwJD" DOUBLE PRECISION NOT NULL,
    "phi" DOUBLE PRECISION NOT NULL,
    "k1" DOUBLE PRECISION NOT NULL,
    "k14" DOUBLE PRECISION NOT NULL,
    "k16" DOUBLE PRECISION NOT NULL,
    "k17" DOUBLE PRECISION NOT NULL,
    "designLoad" DOUBLE PRECISION NOT NULL,
    "screwPenetration" DOUBLE PRECISION NOT NULL,
    "firstTimberThickness" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoltStrength" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "phi" DOUBLE PRECISION NOT NULL,
    "k1" DOUBLE PRECISION NOT NULL,
    "k16" DOUBLE PRECISION NOT NULL,
    "k17" DOUBLE PRECISION NOT NULL,
    "qsk" DOUBLE PRECISION NOT NULL,
    "designStrength" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoltStrength_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weld" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "phi" DOUBLE PRECISION NOT NULL,
    "vw" DOUBLE PRECISION NOT NULL,
    "fuw" DOUBLE PRECISION NOT NULL,
    "tt" DOUBLE PRECISION NOT NULL,
    "kr" DOUBLE PRECISION NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Weld_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "BeamAnalysis" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "span" DOUBLE PRECISION NOT NULL,
    "slabThickness" DOUBLE PRECISION NOT NULL,
    "floorLoadWidth" DOUBLE PRECISION NOT NULL,
    "roofLoadWidth" DOUBLE PRECISION NOT NULL,
    "wallHeight" DOUBLE PRECISION NOT NULL,
    "slabDensity" DOUBLE PRECISION NOT NULL,
    "slabLiveLoad" DOUBLE PRECISION NOT NULL,
    "flooringLoad" DOUBLE PRECISION NOT NULL,
    "roofDeadLoad" DOUBLE PRECISION NOT NULL,
    "roofLiveLoad" DOUBLE PRECISION NOT NULL,
    "wallDeadLoad" DOUBLE PRECISION NOT NULL,
    "totalDeadLoad" DOUBLE PRECISION NOT NULL,
    "totalLiveLoad" DOUBLE PRECISION NOT NULL,
    "ultimateLoad" DOUBLE PRECISION NOT NULL,
    "moment" DOUBLE PRECISION NOT NULL,
    "shear" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeamAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlabAnalysis" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "span" DOUBLE PRECISION NOT NULL,
    "slabThickness" DOUBLE PRECISION NOT NULL,
    "loadWidth" DOUBLE PRECISION NOT NULL,
    "slabDensity" DOUBLE PRECISION NOT NULL,
    "slabLiveLoad" DOUBLE PRECISION NOT NULL,
    "flooringLoad" DOUBLE PRECISION NOT NULL,
    "totalDeadLoad" DOUBLE PRECISION NOT NULL,
    "totalLiveLoad" DOUBLE PRECISION NOT NULL,
    "ultimateLoad" DOUBLE PRECISION NOT NULL,
    "moment" DOUBLE PRECISION NOT NULL,
    "shear" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlabAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrewStrength" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "screwType" "ScrewType" NOT NULL,
    "category" "Category",
    "screwSize" "ScrewSize",
    "jdType" "JDType",
    "load" "Load",
    "loadType" "LoadType",
    "phi" DOUBLE PRECISION,
    "k1" DOUBLE PRECISION,
    "k13" DOUBLE PRECISION,
    "k14" DOUBLE PRECISION,
    "k16" DOUBLE PRECISION,
    "k17" DOUBLE PRECISION,
    "screwJD" DOUBLE PRECISION,
    "shankDiameter" DOUBLE PRECISION,
    "lp" DOUBLE PRECISION,
    "qk" DOUBLE PRECISION,
    "DesignLoad" DOUBLE PRECISION,
    "screwPenetration" DOUBLE PRECISION,
    "firstTimberThickness" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrewStrength_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nails" ADD CONSTRAINT "Nails_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoltStrength" ADD CONSTRAINT "BoltStrength_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weld" ADD CONSTRAINT "Weld_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilAnalysis" ADD CONSTRAINT "SoilAnalysis_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeamAnalysis" ADD CONSTRAINT "BeamAnalysis_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlabAnalysis" ADD CONSTRAINT "SlabAnalysis_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrewStrength" ADD CONSTRAINT "ScrewStrength_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE CASCADE ON UPDATE CASCADE;
