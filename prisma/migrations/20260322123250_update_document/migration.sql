/*
  Warnings:

  - The `currentStatus` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `documentType` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `TrackingHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('VISA', 'KITAS', 'PASSPORT');

-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('RECEIVED', 'IN_REVIEW', 'IN_PROCESS', 'APPROVED', 'REJECTED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "documentType",
ADD COLUMN     "documentType" "DocType" NOT NULL,
DROP COLUMN "currentStatus",
ADD COLUMN     "currentStatus" "DocStatus" NOT NULL DEFAULT 'RECEIVED';

-- AlterTable
ALTER TABLE "TrackingHistory" DROP COLUMN "status",
ADD COLUMN     "status" "DocStatus" NOT NULL;
