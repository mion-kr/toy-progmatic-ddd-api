/*
  Warnings:

  - You are about to drop the column `partners_id` on the `PRODUCT` table. All the data in the column will be lost.
  - You are about to drop the `PARTNERS` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `PRODUCT` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product"."PRODUCT" DROP CONSTRAINT "PRODUCT_partners_id_fkey";

-- AlterTable
ALTER TABLE "product"."PRODUCT" DROP COLUMN "partners_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "partners"."PARTNERS";

-- CreateTable
CREATE TABLE "auth"."ROLE" (
    "id" "auth"."ROLE_TYPE" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ROLE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."USER_ROLE" (
    "userId" TEXT NOT NULL,
    "roleId" "auth"."ROLE_TYPE" NOT NULL,

    CONSTRAINT "USER_ROLE_pkey" PRIMARY KEY ("userId","roleId")
);

-- AddForeignKey
ALTER TABLE "user"."USER_ROLE" ADD CONSTRAINT "USER_ROLE_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"."USER"("sns_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."USER_ROLE" ADD CONSTRAINT "USER_ROLE_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "auth"."ROLE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product"."PRODUCT" ADD CONSTRAINT "PRODUCT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."USER"("sns_id") ON DELETE RESTRICT ON UPDATE CASCADE;
