/*
  Warnings:

  - Added the required column `pileHeight` to the `PileSlabAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PileSlabAnalysis" ADD COLUMN     "pileHeight" DOUBLE PRECISION NOT NULL;
