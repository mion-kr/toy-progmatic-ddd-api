/*
  Warnings:

  - The values [COMPLETED] on the enum `SCHEDULE_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "schedule"."SCHEDULE_STATUS_new" AS ENUM ('OPEN', 'CLOSE', 'WAITING_LAUNCH');
ALTER TABLE "schedule"."SCHEDULE" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "schedule"."SCHEDULE" ALTER COLUMN "status" TYPE "schedule"."SCHEDULE_STATUS_new" USING ("status"::text::"schedule"."SCHEDULE_STATUS_new");
ALTER TYPE "schedule"."SCHEDULE_STATUS" RENAME TO "SCHEDULE_STATUS_old";
ALTER TYPE "schedule"."SCHEDULE_STATUS_new" RENAME TO "SCHEDULE_STATUS";
DROP TYPE "schedule"."SCHEDULE_STATUS_old";
ALTER TABLE "schedule"."SCHEDULE" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;
