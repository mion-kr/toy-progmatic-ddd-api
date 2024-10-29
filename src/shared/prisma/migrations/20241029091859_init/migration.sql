-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "common";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "partners";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "product";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "reservation";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "schedule";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateEnum
CREATE TYPE "auth"."ROLE_TYPE" AS ENUM ('USER', 'PARTNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "product"."PRODUCT_STATUS" AS ENUM ('DISPLAY', 'HIDE');

-- CreateEnum
CREATE TYPE "schedule"."SCHEDULE_STATUS" AS ENUM ('OPEN', 'CLOSE', 'WAITING_LAUNCH', 'COMPLETED');

-- CreateEnum
CREATE TYPE "reservation"."RESERVATION_STATUS" AS ENUM ('PAYMENT_WAITING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "user"."USER" (
    "snsId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nick_name" TEXT,
    "profile_image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("snsId")
);

-- CreateTable
CREATE TABLE "partners"."PARTNERS" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "business_number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PARTNERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product"."PRODUCT" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "operation_time" TEXT NOT NULL,
    "head_count" INTEGER NOT NULL,
    "min_head_count" INTEGER NOT NULL,
    "display_status" "product"."PRODUCT_STATUS" NOT NULL DEFAULT 'DISPLAY',
    "partnersId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PRODUCT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product"."PRODUCT_FISH" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fishId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PRODUCT_FISH_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule"."SCHEDULE" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fishing_date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "operation_time" TEXT NOT NULL,
    "allocation_time" TEXT NOT NULL,
    "head_count" INTEGER NOT NULL,
    "min_head_count" INTEGER NOT NULL,
    "status" "schedule"."SCHEDULE_STATUS" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "SCHEDULE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule"."SCHEDULE_FISH" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "fishId" TEXT NOT NULL,

    CONSTRAINT "SCHEDULE_FISH_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation"."RESERVATION" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "head_count" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "reservation"."RESERVATION_STATUS" NOT NULL DEFAULT 'PAYMENT_WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "RESERVATION_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation"."PAYMENT" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "PAYMENT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation"."REFUND" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "head_count" INTEGER NOT NULL,

    CONSTRAINT "REFUND_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common"."CODE" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "codeGroupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "CODE_pkey" PRIMARY KEY ("code","codeGroupId")
);

-- CreateTable
CREATE TABLE "common"."CODE_GROUP" (
    "code_group" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "CODE_GROUP_pkey" PRIMARY KEY ("code_group")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_email_key" ON "user"."USER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PARTNERS_business_number_key" ON "partners"."PARTNERS"("business_number");

-- AddForeignKey
ALTER TABLE "product"."PRODUCT" ADD CONSTRAINT "PRODUCT_partnersId_fkey" FOREIGN KEY ("partnersId") REFERENCES "partners"."PARTNERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product"."PRODUCT_FISH" ADD CONSTRAINT "PRODUCT_FISH_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"."PRODUCT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule"."SCHEDULE" ADD CONSTRAINT "SCHEDULE_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"."PRODUCT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule"."SCHEDULE_FISH" ADD CONSTRAINT "SCHEDULE_FISH_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedule"."SCHEDULE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation"."RESERVATION" ADD CONSTRAINT "RESERVATION_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."USER"("snsId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation"."RESERVATION" ADD CONSTRAINT "RESERVATION_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"."SCHEDULE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation"."PAYMENT" ADD CONSTRAINT "PAYMENT_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservation"."RESERVATION"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation"."REFUND" ADD CONSTRAINT "REFUND_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "reservation"."PAYMENT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "common"."CODE" ADD CONSTRAINT "CODE_codeGroupId_fkey" FOREIGN KEY ("codeGroupId") REFERENCES "common"."CODE_GROUP"("code_group") ON DELETE RESTRICT ON UPDATE CASCADE;
