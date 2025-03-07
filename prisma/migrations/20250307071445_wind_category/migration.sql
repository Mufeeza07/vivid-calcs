-- CreateEnum
CREATE TYPE "WindCategory" AS ENUM ('N1_W28N', 'N2_W33N', 'N3_W41N', 'N4_W50N', 'N5_W60N', 'N6_W70N', 'C1_W41N', 'C2_W50N', 'C3_W60N', 'C4_W70N');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "windCategory" "WindCategory" NOT NULL DEFAULT 'N1_W28N';
