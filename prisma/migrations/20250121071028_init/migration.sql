-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('STEEL_TO_STEEL', 'TIMBER_TO_TIMBER', 'TIMBER_TO_STEEL');

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
