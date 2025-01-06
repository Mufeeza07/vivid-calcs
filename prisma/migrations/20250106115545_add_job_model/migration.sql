-- CreateTable
CREATE TABLE "Job" (
    "jobId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "locationFromCoastline" TEXT NOT NULL,
    "councilName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("jobId")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
