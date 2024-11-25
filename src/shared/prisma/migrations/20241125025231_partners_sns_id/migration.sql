/*
  Warnings:

  - The primary key for the `USER` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `snsId` on the `USER` table. All the data in the column will be lost.
  - Added the required column `sns_id` to the `USER` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reservation"."RESERVATION" DROP CONSTRAINT "RESERVATION_user_id_fkey";

-- AlterTable
ALTER TABLE "partners"."PARTNERS" ALTER COLUMN "password" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user"."USER" DROP CONSTRAINT "USER_pkey",
DROP COLUMN "snsId",
ADD COLUMN     "sns_id" TEXT NOT NULL,
ADD CONSTRAINT "USER_pkey" PRIMARY KEY ("sns_id");

-- AddForeignKey
ALTER TABLE "reservation"."RESERVATION" ADD CONSTRAINT "RESERVATION_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."USER"("sns_id") ON DELETE RESTRICT ON UPDATE CASCADE;
