/*
  Warnings:

  - The primary key for the `AssemblyLine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PaintingStation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `WeldingRobot` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AssemblyLine" DROP CONSTRAINT "AssemblyLine_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "AssemblyLine_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AssemblyLine_id_seq";

-- AlterTable
ALTER TABLE "PaintingStation" DROP CONSTRAINT "PaintingStation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PaintingStation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PaintingStation_id_seq";

-- AlterTable
ALTER TABLE "WeldingRobot" DROP CONSTRAINT "WeldingRobot_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WeldingRobot_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WeldingRobot_id_seq";
