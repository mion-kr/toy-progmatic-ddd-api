/*
  Warnings:

  - Made the column `updated_by` on table `CODE` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `CODE_GROUP` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `PARTNERS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `PRODUCT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `PRODUCT_FISH` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `PAYMENT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `RESERVATION` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_by` on table `SCHEDULE` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `created_by` to the `SCHEDULE_FISH` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SCHEDULE_FISH` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `SCHEDULE_FISH` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_by` on table `USER` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "common"."CODE" ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "common"."CODE_GROUP" ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "partners"."PARTNERS" ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "product"."PRODUCT" ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "product"."PRODUCT_FISH" ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "reservation"."PAYMENT" ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "reservation"."RESERVATION" ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "schedule"."SCHEDULE" ALTER COLUMN "updated_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "schedule"."SCHEDULE_FISH" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user"."USER" ALTER COLUMN "updated_by" SET NOT NULL;
