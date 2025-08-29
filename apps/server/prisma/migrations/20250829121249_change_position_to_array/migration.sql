/*
  Warnings:

  - You are about to drop the column `destinationLat` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `destinationLon` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Room" DROP COLUMN "destinationLat",
DROP COLUMN "destinationLon",
ADD COLUMN     "destinationPosition" DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "position" DOUBLE PRECISION[];
