/*
  Warnings:

  - The primary key for the `PARTNERS` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sns_id` on the `PARTNERS` table. All the data in the column will be lost.
  - You are about to drop the column `partnersId` on the `PRODUCT` table. All the data in the column will be lost.
  - Added the required column `sns_id_2` to the `PARTNERS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partners_id` to the `PRODUCT` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product"."PRODUCT" DROP CONSTRAINT "PRODUCT_partnersId_fkey";

-- AlterTable
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "sns_id" TO "sns_id_2";

