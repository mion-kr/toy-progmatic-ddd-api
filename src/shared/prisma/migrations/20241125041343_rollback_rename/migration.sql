/*
  Warnings:

  - The primary key for the `PARTNERS` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sns_id_2` on the `PARTNERS` table. All the data in the column will be lost.
  - You are about to drop the column `partnersId` on the `PRODUCT` table. All the data in the column will be lost.
  - Added the required column `sns_id` to the `PARTNERS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partners_id` to the `PRODUCT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "partners"."PARTNERS" DROP CONSTRAINT "PARTNERS_pkey";
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "sns_id_2" TO "sns_id";
ALTER TABLE "partners"."PARTNERS" ADD CONSTRAINT "PARTNERS_pkey" PRIMARY KEY ("sns_id");

-- AlterTable
ALTER TABLE "product"."PRODUCT" RENAME COLUMN "partnersId" TO "partners_id";

-- AddForeignKey
ALTER TABLE "product"."PRODUCT" ADD CONSTRAINT "PRODUCT_partners_id_fkey" FOREIGN KEY ("partners_id") REFERENCES "partners"."PARTNERS"("sns_id") ON DELETE RESTRICT ON UPDATE CASCADE;
