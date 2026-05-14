/*
  Warnings:

  - You are about to drop the column `name` on the `PrescriptionItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `PrescriptionItem` table. All the data in the column will be lost.
  - Added the required column `duration` to the `PrescriptionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `PrescriptionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicineName` to the `PrescriptionItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PrescriptionItem" DROP COLUMN "name",
DROP COLUMN "quantity",
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "frequency" TEXT NOT NULL,
ADD COLUMN     "medicineName" TEXT NOT NULL;
