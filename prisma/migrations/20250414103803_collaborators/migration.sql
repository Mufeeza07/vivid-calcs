/*
  Warnings:

  - You are about to drop the column `collaborators` on the `Job` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('VIEWER', 'EDITOR');

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "collaborators",
ADD COLUMN     "area" TEXT,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "lastEditedBy" TEXT;

-- CreateTable
CREATE TABLE "JobCollaborator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "permission" "Permission" DEFAULT 'VIEWER',

    CONSTRAINT "JobCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobCollaborator_userId_jobId_key" ON "JobCollaborator"("userId", "jobId");

-- AddForeignKey
ALTER TABLE "JobCollaborator" ADD CONSTRAINT "JobCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCollaborator" ADD CONSTRAINT "JobCollaborator_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("jobId") ON DELETE RESTRICT ON UPDATE CASCADE;
