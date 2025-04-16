/*
  Warnings:

  - Added the required column `title` to the `BeamSlabAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `BoltStrength` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Nails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `PileAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ScrewStrength` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `SoilAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Weld` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STAFF';

-- AlterTable
ALTER TABLE "BeamSlabAnalysis" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BoltStrength" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobCollaborator" ADD COLUMN     "addedBy" TEXT;

-- AlterTable
ALTER TABLE "Nails" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PileAnalysis" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ScrewStrength" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SoilAnalysis" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Weld" ADD COLUMN     "title" TEXT NOT NULL;
