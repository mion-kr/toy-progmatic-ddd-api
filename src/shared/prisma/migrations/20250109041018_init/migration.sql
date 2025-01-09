-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "ROLE_TYPE_ENUM" AS ENUM ('USER', 'PARTNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PRODUCT_STATUS_ENUM" AS ENUM ('DISPLAY', 'HIDE');

-- CreateEnum
CREATE TYPE "SCHEDULE_STATUS_ENUM" AS ENUM ('OPEN', 'CLOSE', 'WAITING_LAUNCH');

-- CreateEnum
CREATE TYPE "RESERVATION_STATUS_ENUM" AS ENUM ('PAYMENT_WAITING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ROLE" (
    "id" "ROLE_TYPE_ENUM" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ROLE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_ROLE" (
    "userId" TEXT NOT NULL,
    "roleId" "ROLE_TYPE_ENUM" NOT NULL,

    CONSTRAINT "USER_ROLE_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "USER" (
    "sns_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nick_name" TEXT,
    "profile_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("sns_id")
);

-- CreateTable
CREATE TABLE "PRODUCT" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "operation_time" TEXT NOT NULL,
    "head_count" INTEGER NOT NULL,
    "min_head_count" INTEGER NOT NULL,
    "display_status" "PRODUCT_STATUS_ENUM" NOT NULL DEFAULT 'DISPLAY',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "PRODUCT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCT_FISH" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fishId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "PRODUCT_FISH_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEDULE" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fishing_date" TIMESTAMPTZ NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "operation_time" TEXT NOT NULL,
    "allocation_time" TEXT NOT NULL,
    "head_count" INTEGER NOT NULL,
    "min_head_count" INTEGER NOT NULL,
    "status" "SCHEDULE_STATUS_ENUM" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "SCHEDULE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SCHEDULE_FISH" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "fishId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "SCHEDULE_FISH_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RESERVATION" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "head_count" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "RESERVATION_STATUS_ENUM" NOT NULL DEFAULT 'PAYMENT_WAITING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "RESERVATION_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PAYMENT" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "PAYMENT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REFUND" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "head_count" INTEGER NOT NULL,

    CONSTRAINT "REFUND_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CODE" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "codeGroupId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "CODE_pkey" PRIMARY KEY ("code","codeGroupId")
);

-- CreateTable
CREATE TABLE "CODE_GROUP" (
    "code_group" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "CODE_GROUP_pkey" PRIMARY KEY ("code_group")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_email_key" ON "USER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PAYMENT_reservation_id_key" ON "PAYMENT"("reservation_id");

-- AddForeignKey
ALTER TABLE "USER_ROLE" ADD CONSTRAINT "USER_ROLE_userId_fkey" FOREIGN KEY ("userId") REFERENCES "USER"("sns_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USER_ROLE" ADD CONSTRAINT "USER_ROLE_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ROLE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRODUCT" ADD CONSTRAINT "PRODUCT_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USER"("sns_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRODUCT_FISH" ADD CONSTRAINT "PRODUCT_FISH_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PRODUCT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEDULE" ADD CONSTRAINT "SCHEDULE_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PRODUCT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SCHEDULE_FISH" ADD CONSTRAINT "SCHEDULE_FISH_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "SCHEDULE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RESERVATION" ADD CONSTRAINT "RESERVATION_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USER"("sns_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RESERVATION" ADD CONSTRAINT "RESERVATION_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "SCHEDULE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PAYMENT" ADD CONSTRAINT "PAYMENT_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "RESERVATION"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "REFUND" ADD CONSTRAINT "REFUND_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "PAYMENT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CODE" ADD CONSTRAINT "CODE_codeGroupId_fkey" FOREIGN KEY ("codeGroupId") REFERENCES "CODE_GROUP"("code_group") ON DELETE RESTRICT ON UPDATE CASCADE;
