import { Request } from 'express';
import {
  AssemblyLinePart,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart,
  partInfo,
} from '../native-app/data/types';
import { calculateMachineHealth } from './calculations';
import {
  PaintingStation,
  WeldingRobot,
  QualityControlStation,
  AssemblyLine,
} from '@prisma/client';
import { getAllMachines } from './addMachineHealthToDatabase';

// Type checking functions for the prisma model types, so we can
// identify the type of a given machine returned by the database
const isWeldingRobot = (machine: any) => {
  return 'errorRate' in machine;
};

const isPaintingStation = (machine: any) => {
  return 'flowRate' in machine;
};

const isAssemblyLine = (machine: any) => {
  return 'alignmentAccuracy' in machine;
};

const isQualityControlStation = (machine: any) => {
  return 'cameraCalibration' in machine;
};

export const getMachineHealth = async (req: Request) => {
  const machines: (
    | WeldingRobot
    | PaintingStation
    | AssemblyLine
    | QualityControlStation
  )[] = await getAllMachines();

  console.log('Here are machines', machines);

  // Initilize the machine scores dictionary
  const machineScores: {
    [key in MachineType]?: string;
  } = {};
  let factoryScore = 0;
  let machineCount = 0;

  // Calculate scores for each machine
  for (const machine of machines) {
    let machineType;
    let machineParts = [];

    // Get the machine's type and parts
    if (isWeldingRobot(machine)) {
      machineType = MachineType.WeldingRobot;
      machineParts = Object.keys(
        machine as WeldingRobot
      ) as (keyof WeldingRobot)[];
    } else if (isPaintingStation(machine)) {
      machineType = MachineType.PaintingStation;
      machineParts = Object.keys(
        machine as PaintingStation
      ) as (keyof PaintingStation)[];
    } else if (isAssemblyLine(machine)) {
      machineType = MachineType.AssemblyLine;
      machineParts = Object.keys(
        machine as AssemblyLine
      ) as (keyof AssemblyLine)[];
    } else if (isQualityControlStation(machine)) {
      machineType = MachineType.QualityControlStation;
      machineParts = Object.keys(
        machine as QualityControlStation
      ) as (keyof QualityControlStation)[];
    } else {
      console.log('Error machine could not be identified:', machine);
      continue;
    }

    // Filter out the id and dateCreated fields from the machineParts
    machineParts = machineParts.filter((field) => {
      return !(field === 'id' || field === 'dateCreated');
    });

    // Convert the machine parts array into an array of type partInfo[]
    const machinePartInfos: partInfo[] = machineParts.map((part: string) => {
      const machinePartInfo: partInfo = {
        name: part as AssemblyLinePart,
        value: (machine as AssemblyLine)[part as keyof AssemblyLine] as number,
      };
      return machinePartInfo;
    });

    // Filter out any machine parts whose value is 0
    const filteredMachinePartInfos: partInfo[] = machinePartInfos.filter(
      (partInfoObject: partInfo) => !(partInfoObject.value === 0)
    );

    // Calculate the machine's score using its <machineType> and <machinePartInfos>,
    // and add it to the machineScores dictionary
    const machineScore = calculateMachineHealth(
      machineType,
      filteredMachinePartInfos
    );
    machineScores[machineType] = machineScore.toFixed(2);

    factoryScore += machineScore;
    machineCount++;
  }

  // Calculate the factory score (average of machine scores)
  factoryScore = machineCount > 0 ? factoryScore / machineCount : 0;

  return {
    factory: factoryScore.toFixed(2),
    machineScores,
  };
};
