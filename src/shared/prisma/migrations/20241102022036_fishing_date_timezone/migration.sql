-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- AlterTable
ALTER TABLE "schedule"."SCHEDULE" ALTER COLUMN "fishing_date" SET DATA TYPE TIMESTAMPTZ;
