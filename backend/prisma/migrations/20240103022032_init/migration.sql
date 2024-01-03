-- CreateTable
CREATE TABLE "WeldingRobot" (
    "id" SERIAL NOT NULL,
    "weldingRobotErrorRate" DOUBLE PRECISION NOT NULL,
    "weldingArmVibrationLevel" DOUBLE PRECISION NOT NULL,
    "electrodeWear" DOUBLE PRECISION NOT NULL,
    "gasShieldingPressure" DOUBLE PRECISION NOT NULL,
    "weldingWireFeedRate" DOUBLE PRECISION NOT NULL,
    "arcStability" DOUBLE PRECISION NOT NULL,
    "weldSeamWidth" DOUBLE PRECISION NOT NULL,
    "coolingSystemEfficiency" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WeldingRobot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintingStation" (
    "id" SERIAL NOT NULL,
    "paintFlowRate" DOUBLE PRECISION NOT NULL,
    "paintPressure" DOUBLE PRECISION NOT NULL,
    "paintColorConsistency" DOUBLE PRECISION NOT NULL,
    "paintNozzleCondition" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PaintingStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssemblyLine" (
    "id" SERIAL NOT NULL,
    "partAlignmentAccuracy" DOUBLE PRECISION NOT NULL,
    "assemblyLineSpeed" DOUBLE PRECISION NOT NULL,
    "componentFittingTolerance" DOUBLE PRECISION NOT NULL,
    "conveyorBeltSpeed" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AssemblyLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityControlStation" (
    "id" SERIAL NOT NULL,
    "inspectionCameraCalibration" DOUBLE PRECISION NOT NULL,
    "inspectionLightIntensity" DOUBLE PRECISION NOT NULL,
    "inspectionSoftwareVersion" DOUBLE PRECISION NOT NULL,
    "inspectionCriteriaSettings" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QualityControlStation_pkey" PRIMARY KEY ("id")
);
