-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOCTOR', 'STAFF');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "Agama" AS ENUM ('ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDDHA', 'KONGHUCU');

-- CreateEnum
CREATE TYPE "StatusKawin" AS ENUM ('BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI');

-- CreateEnum
CREATE TYPE "LayananDifabel" AS ENUM ('YA', 'TIDAK');

-- CreateEnum
CREATE TYPE "GolDarah" AS ENUM ('A', 'B', 'AB', 'O');

-- CreateEnum
CREATE TYPE "Rhesus" AS ENUM ('POSITIF', 'NEGATIF');

-- CreateEnum
CREATE TYPE "Clinic" AS ENUM ('LANSIA', 'INFEKSIUS_A', 'INFEKSIUS_B', 'INFEKSIUS_C', 'NON_INFEKSIUS_A', 'NON_INFEKSIUS_B', 'NON_INFEKSIUS_C', 'UGD', 'GIGI', 'KIA', 'UMUM');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'TIDAK_HADIR', 'PEMBATALAN');

-- CreateEnum
CREATE TYPE "TargetStatus" AS ENUM ('TIDAK', 'HT', 'DM', 'HT_DM');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BPJS', 'MANDIRI', 'ASURANSI');

-- CreateEnum
CREATE TYPE "Kesadaran" AS ENUM ('KOMPOS_MENTIS', 'APATIS', 'SOMNOLENT', 'SOPOR', 'KOMA');

-- CreateEnum
CREATE TYPE "RekamMedisStatus" AS ENUM ('DRAFT', 'SELESAI');

-- CreateEnum
CREATE TYPE "StatusPulang" AS ENUM ('SEMBUH', 'MEMBAIK', 'KONTROL', 'RUJUK', 'MENINGGAL');

-- CreateEnum
CREATE TYPE "PatientTargetData_targetStatus" AS ENUM ('TIDAK', 'HT', 'DM', 'HT_DM');

-- CreateEnum
CREATE TYPE "PatientTargetData_remindedKunjunganD7" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PulangRujuk_remindedKunjunganD1" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PatientTargetData_remindedKunjunganD3" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PulangRujuk_remindedKunjunganD3" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PatientTargetData_remindedKunjunganD1" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PulangRujuk_remindedKunjunganD7" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PatientTargetData_remindedPemeriksaanD7" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PulangRujuk_remindedPemeriksaanD1" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PatientTargetData_remindedPemeriksaanD3" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PulangRujuk_remindedPemeriksaanD3" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PatientTargetData_remindedPemeriksaanD1" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PulangRujuk_remindedPemeriksaanD7" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PulangRujuk_remindedKunjunganLate" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateEnum
CREATE TYPE "PulangRujuk_remindedPemeriksaanLate" AS ENUM ('NOT_REMINDED', 'REMINDED_SUCCESS', 'REMINDED_FAILED', 'NO_PHONE', 'MISSING_PARAMS', 'BAD_AUTH', 'NETWORK_ERROR', 'INVALID_NUMBER', 'SESSION_ERROR', 'RATE_LIMIT', 'AUTH_ERROR', 'WAHA_ERROR', 'UNKNOWN_ERROR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pasien" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "noKk" TEXT NOT NULL,
    "noJkn" TEXT NOT NULL,
    "catatanJkn" TEXT NOT NULL,
    "noJamkesos" TEXT NOT NULL,
    "catatanJamkesos" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tempatLahir" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "umur" INTEGER,
    "agama" "Agama",
    "statusKawin" "StatusKawin",
    "alamatTinggal" TEXT,
    "alamatKtp" TEXT,
    "alamatDomisili" TEXT,
    "provinsi" TEXT,
    "kabupaten" TEXT,
    "kecamatan" TEXT,
    "kelurahanDesa" TEXT,
    "rtRw" TEXT,
    "noTlp" TEXT,
    "pemilikNoTlp" TEXT,
    "email" TEXT,
    "layananDifabel" "LayananDifabel",
    "pendidikan" TEXT,
    "pekerjaan" TEXT,
    "golDarah" "GolDarah",
    "rhesus" "Rhesus",
    "namaIbuKandung" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pasien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RekamMedis" (
    "id" TEXT NOT NULL,
    "pasienId" TEXT NOT NULL,
    "pendaftaranId" TEXT NOT NULL,
    "kajianAwalId" TEXT NOT NULL,
    "anamnesisId" TEXT NOT NULL,
    "pemeriksaanId" TEXT NOT NULL,
    "diagnosisId" TEXT NOT NULL,
    "tindakanId" TEXT NOT NULL,
    "pengobatanId" TEXT NOT NULL,
    "pulangRujukId" TEXT NOT NULL,
    "asuhanId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "status" "RekamMedisStatus" NOT NULL DEFAULT 'DRAFT',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RekamMedis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pendaftaran" (
    "id" TEXT NOT NULL,
    "tglKunjungan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noAntrian" TEXT NOT NULL,
    "unitLayanan" TEXT NOT NULL,
    "jenisLayanan" TEXT NOT NULL,
    "noRegis" TEXT NOT NULL,
    "poliklinik" "Clinic" NOT NULL,
    "kehadiran" "AttendanceStatus" NOT NULL,
    "targetStatus" "TargetStatus" NOT NULL DEFAULT 'TIDAK',
    "pembayaran" "PaymentMethod" NOT NULL,
    "catatan" TEXT,

    CONSTRAINT "Pendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KajianAwal" (
    "id" TEXT NOT NULL,
    "alergi" TEXT,
    "riwayatPenyakitDahulu" TEXT,
    "riwayatPenyakitKeluarga" TEXT,

    CONSTRAINT "KajianAwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anamnesis" (
    "id" TEXT NOT NULL,
    "keluhan" TEXT,

    CONSTRAINT "Anamnesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pemeriksaan" (
    "id" TEXT NOT NULL,
    "keadaan" TEXT,
    "kesadaran" "Kesadaran",
    "respirasi" INTEGER,
    "suhu" DOUBLE PRECISION,
    "nadi" INTEGER,
    "sistol" INTEGER,
    "diastol" INTEGER,

    CONSTRAINT "Pemeriksaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" TEXT NOT NULL,
    "diagnosis" TEXT,
    "kodeIcd" TEXT,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tindakan" (
    "id" TEXT NOT NULL,
    "tindakan" TEXT,

    CONSTRAINT "Tindakan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengobatan" (
    "id" TEXT NOT NULL,
    "pengobatan" JSONB,

    CONSTRAINT "Pengobatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PulangRujuk" (
    "id" TEXT NOT NULL,
    "tglPulang" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "statusPulang" "StatusPulang",
    "kie" TEXT,
    "plan" TEXT,
    "rencKunjBerikutnya" TIMESTAMP(3),
    "rencPemeriksaan6Bln" TIMESTAMP(3),
    "rujukInternal" TEXT,
    "rujukEksternal" TEXT,
    "remindedKunjunganD1" "PulangRujuk_remindedKunjunganD1" NOT NULL DEFAULT 'NOT_REMINDED',
    "remindedKunjunganD3" "PulangRujuk_remindedKunjunganD3" NOT NULL DEFAULT 'NOT_REMINDED',
    "remindedKunjunganD7" "PulangRujuk_remindedKunjunganD7" NOT NULL DEFAULT 'NOT_REMINDED',
    "remindedPemeriksaanD1" "PulangRujuk_remindedPemeriksaanD1" NOT NULL DEFAULT 'NOT_REMINDED',
    "remindedPemeriksaanD3" "PulangRujuk_remindedPemeriksaanD3" NOT NULL DEFAULT 'NOT_REMINDED',
    "remindedPemeriksaanD7" "PulangRujuk_remindedPemeriksaanD7" NOT NULL DEFAULT 'NOT_REMINDED',
    "remindedKunjunganLate" "PulangRujuk_remindedKunjunganLate" NOT NULL DEFAULT 'NOT_REMINDED',
    "remindedPemeriksaanLate" "PulangRujuk_remindedPemeriksaanLate" NOT NULL DEFAULT 'NOT_REMINDED',

    CONSTRAINT "PulangRujuk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asuhan" (
    "id" TEXT NOT NULL,
    "diagnosaData" TEXT,
    "diagnosa" TEXT,
    "intervensi" TEXT,
    "implementasi" TEXT,
    "evaluasi" TEXT,

    CONSTRAINT "Asuhan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL,
    "permintaanPemeriksaan" TEXT,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "PostVisit" (
    "id" TEXT NOT NULL,
    "rekamMedisId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Pasien_nik_key" ON "Pasien"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "Pasien_noJkn_key" ON "Pasien"("noJkn");

-- CreateIndex
CREATE UNIQUE INDEX "Pasien_noJamkesos_key" ON "Pasien"("noJamkesos");

-- CreateIndex
CREATE UNIQUE INDEX "Pasien_noTlp_key" ON "Pasien"("noTlp");

-- CreateIndex
CREATE UNIQUE INDEX "Pasien_email_key" ON "Pasien"("email");

-- CreateIndex
CREATE INDEX "Pasien_nama_idx" ON "Pasien"("nama");

-- CreateIndex
CREATE INDEX "Pasien_nik_idx" ON "Pasien"("nik");

-- CreateIndex
CREATE INDEX "Pasien_noKk_idx" ON "Pasien"("noKk");

-- CreateIndex
CREATE INDEX "Pasien_noJkn_idx" ON "Pasien"("noJkn");

-- CreateIndex
CREATE INDEX "Pasien_noJamkesos_idx" ON "Pasien"("noJamkesos");

-- CreateIndex
CREATE UNIQUE INDEX "PostVisit_rekamMedisId_key" ON "PostVisit"("rekamMedisId");

-- CreateIndex
CREATE UNIQUE INDEX "PostVisit_token_key" ON "PostVisit"("token");

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_anamnesisId_fkey" FOREIGN KEY ("anamnesisId") REFERENCES "Anamnesis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_asuhanId_fkey" FOREIGN KEY ("asuhanId") REFERENCES "Asuhan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "Diagnosis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_kajianAwalId_fkey" FOREIGN KEY ("kajianAwalId") REFERENCES "KajianAwal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_pasienId_fkey" FOREIGN KEY ("pasienId") REFERENCES "Pasien"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_pemeriksaanId_fkey" FOREIGN KEY ("pemeriksaanId") REFERENCES "Pemeriksaan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_pengobatanId_fkey" FOREIGN KEY ("pengobatanId") REFERENCES "Pengobatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_pulangRujukId_fkey" FOREIGN KEY ("pulangRujukId") REFERENCES "PulangRujuk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekamMedis" ADD CONSTRAINT "RekamMedis_tindakanId_fkey" FOREIGN KEY ("tindakanId") REFERENCES "Tindakan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVisit" ADD CONSTRAINT "PostVisit_rekamMedisId_fkey" FOREIGN KEY ("rekamMedisId") REFERENCES "RekamMedis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
