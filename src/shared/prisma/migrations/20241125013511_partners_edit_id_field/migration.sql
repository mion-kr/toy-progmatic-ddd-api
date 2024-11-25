/*
  Warnings:

  - The primary key for the `PARTNERS` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PARTNERS` table. All the data in the column will be lost.
  - Added the required column `password` to the `PARTNERS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snsId` to the `PARTNERS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product"."PRODUCT" DROP CONSTRAINT "PRODUCT_partnersId_fkey";

-- AlterTable
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "id" TO "sns_id";
ALTER TABLE "partners"."PARTNERS" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'temp_password';

-- AddForeignKey
ALTER TABLE "product"."PRODUCT" ADD CONSTRAINT "PRODUCT_partnersId_fkey" FOREIGN KEY ("partnersId") REFERENCES "partners"."PARTNERS"("sns_id") ON DELETE RESTRICT ON UPDATE CASCADE;
