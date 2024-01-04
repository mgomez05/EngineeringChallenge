/*
  Warnings:

  - You are about to drop the column `assemblyLineSpeed` on the `AssemblyLine` table. All the data in the column will be lost.
  - You are about to drop the column `componentFittingTolerance` on the `AssemblyLine` table. All the data in the column will be lost.
  - You are about to drop the column `conveyorBeltSpeed` on the `AssemblyLine` table. All the data in the column will be lost.
  - You are about to drop the column `partAlignmentAccuracy` on the `AssemblyLine` table. All the data in the column will be lost.
  - You are about to drop the column `paintColorConsistency` on the `PaintingStation` table. All the data in the column will be lost.
  - You are about to drop the column `paintFlowRate` on the `PaintingStation` table. All the data in the column will be lost.
  - You are about to drop the column `paintNozzleCondition` on the `PaintingStation` table. All the data in the column will be lost.
  - You are about to drop the column `paintPressure` on the `PaintingStation` table. All the data in the column will be lost.
  - You are about to drop the column `inspectionCameraCalibration` on the `QualityControlStation` table. All the data in the column will be lost.
  - You are about to drop the column `inspectionCriteriaSettings` on the `QualityControlStation` table. All the data in the column will be lost.
  - You are about to drop the column `inspectionLightIntensity` on the `QualityControlStation` table. All the data in the column will be lost.
  - You are about to drop the column `inspectionSoftwareVersion` on the `QualityControlStation` table. All the data in the column will be lost.
  - You are about to drop the column `coolingSystemEfficiency` on the `WeldingRobot` table. All the data in the column will be lost.
  - You are about to drop the column `gasShieldingPressure` on the `WeldingRobot` table. All the data in the column will be lost.
  - You are about to drop the column `weldSeamWidth` on the `WeldingRobot` table. All the data in the column will be lost.
  - You are about to drop the column `weldingArmVibrationLevel` on the `WeldingRobot` table. All the data in the column will be lost.
  - You are about to drop the column `weldingRobotErrorRate` on the `WeldingRobot` table. All the data in the column will be lost.
  - You are about to drop the column `weldingWireFeedRate` on the `WeldingRobot` table. All the data in the column will be lost.
  - Added the required column `alignmentAccuracy` to the `AssemblyLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beltSpeed` to the `AssemblyLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fittingTolerance` to the `AssemblyLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speed` to the `AssemblyLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorConsistency` to the `PaintingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flowRate` to the `PaintingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nozzleCondition` to the `PaintingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pressure` to the `PaintingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cameraCalibration` to the `QualityControlStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criteriaSettings` to the `QualityControlStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lightIntensity` to the `QualityControlStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `softwareVersion` to the `QualityControlStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coolingEfficiency` to the `WeldingRobot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `errorRate` to the `WeldingRobot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seamWidth` to the `WeldingRobot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shieldingPressure` to the `WeldingRobot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vibrationLevel` to the `WeldingRobot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wireFeedRate` to the `WeldingRobot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssemblyLine" DROP COLUMN "assemblyLineSpeed",
DROP COLUMN "componentFittingTolerance",
DROP COLUMN "conveyorBeltSpeed",
DROP COLUMN "partAlignmentAccuracy",
ADD COLUMN     "alignmentAccuracy" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "beltSpeed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fittingTolerance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "speed" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "PaintingStation" DROP COLUMN "paintColorConsistency",
DROP COLUMN "paintFlowRate",
DROP COLUMN "paintNozzleCondition",
DROP COLUMN "paintPressure",
ADD COLUMN     "colorConsistency" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "flowRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "nozzleCondition" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "pressure" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "QualityControlStation" DROP COLUMN "inspectionCameraCalibration",
DROP COLUMN "inspectionCriteriaSettings",
DROP COLUMN "inspectionLightIntensity",
DROP COLUMN "inspectionSoftwareVersion",
ADD COLUMN     "cameraCalibration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "criteriaSettings" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lightIntensity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "softwareVersion" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "WeldingRobot" DROP COLUMN "coolingSystemEfficiency",
DROP COLUMN "gasShieldingPressure",
DROP COLUMN "weldSeamWidth",
DROP COLUMN "weldingArmVibrationLevel",
DROP COLUMN "weldingRobotErrorRate",
DROP COLUMN "weldingWireFeedRate",
ADD COLUMN     "coolingEfficiency" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "errorRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "seamWidth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shieldingPressure" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vibrationLevel" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "wireFeedRate" DOUBLE PRECISION NOT NULL;
