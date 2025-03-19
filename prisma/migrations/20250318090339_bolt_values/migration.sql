-- CreateEnum
CREATE TYPE "BoltSize" AS ENUM ('M6', 'M8', 'M10', 'M12', 'M16', 'M20', 'M24', 'M30', 'M36');

-- CreateEnum
CREATE TYPE "TimberThickness" AS ENUM ('TT_25', 'TT_35', 'TT_40', 'TT_45', 'TT_70', 'TT_90', 'TT_105', 'TT_120');

-- AlterTable
ALTER TABLE "BoltStrength" ADD COLUMN     "boltSize" "BoltSize",
ADD COLUMN     "category" "Category",
ADD COLUMN     "jdType" "JDType",
ADD COLUMN     "load" "Load",
ADD COLUMN     "loadType" "LoadType",
ADD COLUMN     "timberThickness" "TimberThickness";
