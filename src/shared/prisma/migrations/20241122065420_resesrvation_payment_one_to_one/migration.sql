/*
  Warnings:

  - A unique constraint covering the columns `[reservation_id]` on the table `PAYMENT` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PAYMENT_reservation_id_key" ON "reservation"."PAYMENT"("reservation_id");
