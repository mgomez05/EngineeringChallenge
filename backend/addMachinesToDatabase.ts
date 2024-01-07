import { Request } from 'express';
import {
  AssemblyLinePart,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart,
} from '../native-app/data/types';
import { getPrismaClient } from './prismaUtils';

type MachinePart =
  | WeldingRobotPart
  | AssemblyLinePart
  | PaintingStationPart
  | QualityControlStationPart;

// NOTE: This function assumes the request body contains the machine's name and parts data
// in the following format:
//   {
//     "machines": {
//       "assemblyLine": {
//         "alignmentAccuracy": 0.5
//       },
//       "weldingRobot": {
//         "vibrationLevel": 4.0,
//         "electrodeWear": 0.8,
//       }
//     }
//   }
export const insertMachineDataToDatabase = async (req: Request) => {
  // Parse the request body into a <machines> record
  const {
    machines,
  }: {
    machines: Record<MachineType, Record<MachinePart, string>>;
  } = req.body;

  // Return null if the request couldn't be parsed
  if (!machines) {
    return null;
  }

  let successCount = 0;
  let totalCount = 0;

  // For each machine in the request body, try to create the machine
  // in the database using prisma
  for (const machineName in machines) {
    // Add to the counter for each machine we attempt to add to the database
    totalCount++;

    // Parse the current machine's type and parts from the request body
    const machineType = machineName as MachineType;
    const machine = machines[machineType] as Record<MachinePart, string>;

    // Try to create the machine in database, in the table indicated by <machineType>
    try {
      let creationResult;
      if (machineType === MachineType.WeldingRobot) {
        console.log('Machine is weldingRobot');
        creationResult = await getPrismaClient().weldingRobot.create({
          data: {
            errorRate: getMachinePartValue(machine, WeldingRobotPart.ErrorRate),
            vibrationLevel: getMachinePartValue(
              machine,
              WeldingRobotPart.VibrationLevel
            ),
            electrodeWear: getMachinePartValue(
              machine,
              WeldingRobotPart.ElectrodeWear
            ),
            shieldingPressure: getMachinePartValue(
              machine,
              WeldingRobotPart.ShieldingPressure
            ),
            wireFeedRate: getMachinePartValue(
              machine,
              WeldingRobotPart.WireFeedRate
            ),
            arcStability: getMachinePartValue(
              machine,
              WeldingRobotPart.ArcStability
            ),
            seamWidth: getMachinePartValue(machine, WeldingRobotPart.SeamWidth),
            coolingEfficiency: getMachinePartValue(
              machine,
              WeldingRobotPart.CoolingEfficiency
            ),
          },
        });
      } else if (machineType === MachineType.PaintingStation) {
        console.log('Machine is paintingStation');
        creationResult = await getPrismaClient().paintingStation.create({
          data: {
            flowRate: getMachinePartValue(
              machine,
              PaintingStationPart.FlowRate
            ),
            pressure: getMachinePartValue(
              machine,
              PaintingStationPart.Pressure
            ),
            colorConsistency: getMachinePartValue(
              machine,
              PaintingStationPart.ColorConsistency
            ),
            nozzleCondition: getMachinePartValue(
              machine,
              PaintingStationPart.NozzleCondition
            ),
          },
        });
      } else if (machineType === MachineType.AssemblyLine) {
        creationResult = await getPrismaClient().assemblyLine.create({
          data: {
            alignmentAccuracy: getMachinePartValue(
              machine,
              AssemblyLinePart.AlignmentAccuracy
            ),
            speed: getMachinePartValue(machine, AssemblyLinePart.Speed),
            fittingTolerance: getMachinePartValue(
              machine,
              AssemblyLinePart.FittingTolerance
            ),
            beltSpeed: getMachinePartValue(machine, AssemblyLinePart.BeltSpeed),
          },
        });
      } else if (machineType === MachineType.QualityControlStation) {
        console.log('Machine is qualityControlStation');
        creationResult = await getPrismaClient().qualityControlStation.create({
          data: {
            cameraCalibration: getMachinePartValue(
              machine,
              QualityControlStationPart.CameraCalibration
            ),
            lightIntensity: getMachinePartValue(
              machine,
              QualityControlStationPart.LightIntensity
            ),
            softwareVersion: getMachinePartValue(
              machine,
              QualityControlStationPart.SoftwareVersion
            ),
            criteriaSettings: getMachinePartValue(
              machine,
              QualityControlStationPart.CriteriaSettings
            ),
          },
        });
      } else {
        console.error(
          `Machine type '${machineType}' was not recognized when trying to create a new machine`
        );
      }

      // Add to the success count if we successfully created the machine
      if (creationResult) {
        successCount++;
      }
    } catch (error) {
      console.error(
        'There was an error creating a machine type',
        machineType,
        ':',
        error
      );
    }
  }

  // If all machines were successfully created, return a json object to be used in the server's response
  // Otherwise, return null so the server knows to send an error response
  if (successCount === totalCount) {
    return {
      message: `Successfully created ${successCount} out of ${totalCount} machines in database`,
    };
  } else {
    return null;
  }
};

// Given the name of a MachinePart <machinePart>, and a record <machine> (with key of type 'MachinePart' and  value of type 'string'),
// returns the value of machine[machinePart] as a float
// If the machine part's value could not be processed, returns 0.0
export const getMachinePartValue = (
  machine: Record<MachinePart, string>,
  machinePart: MachinePart
) => {
  return parseFloat(machine[machinePart]) || 0.0;
};

// Returns all machines in the database as an array of json objects
// Used for the GET /machine endpoint
export const getAllMachines = async () => {
  const weldingRobots = await getPrismaClient().weldingRobot.findMany();
  const assemblyLines = await getPrismaClient().assemblyLine.findMany();
  const paintingStations = await getPrismaClient().paintingStation.findMany();
  const qualityControlStations =
    await getPrismaClient().qualityControlStation.findMany();

  const machines = [
    ...weldingRobots,
    ...assemblyLines,
    ...paintingStations,
    ...qualityControlStations,
  ];

  return machines;
};
