-- AlterTable
ALTER TABLE "RekamMedis" ADD COLUMN     "catatanDokterId" TEXT;

-- CreateTable
CREATE TABLE "CatatanDokter" (
    "id" TEXT NOT NULL,
    "catatan" TEXT,
    "dokterId" TEXT,
    "namaDokter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatatanDokter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_catatanDokterId_fkey" FOREIGN KEY ("catatanDokterId") REFERENCES "CatatanDokter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
