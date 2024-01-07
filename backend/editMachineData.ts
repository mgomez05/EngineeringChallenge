import { Request } from 'express';
import {
  AssemblyLinePart,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart,
} from '../native-app/data/types';
import {
  getMachinePartValue,
  insertMachineDataToDatabase,
} from './addMachinesToDatabase';
import { getPrismaClient } from './prismaUtils';

type MachinePart =
  | WeldingRobotPart
  | AssemblyLinePart
  | PaintingStationPart
  | QualityControlStationPart;

// NOTE: This function assumes the request body contains the machine's name and parts data
// in the following format:
//   {
//     "machineId": "adhf45745hdfhdfh"
//     "machine": {
//       "assemblyLine": {
//         "alignmentAccuracy": 0.5
//       },
//     }
//   }
export const editMachineData = async (req: Request) => {
  const machineId = req.body.machineId;

  // If no machine id was provided, insert the data as a new machine to the database
  if (!machineId) {
    req.body = {
      machines: req.body.machine,
    };
    const machineCreationResult = await insertMachineDataToDatabase(req);

    if (!machineCreationResult) {
      return {
        status: 400,
        error: 'Error creating new machine with provided data',
      };
    }
    return {
      status: 200,
      machineCreationResult,
    };
  }

  // Otherwise, if a machineId was provided, we attempt to update an existing machine
  // - First, we parse request body into a <machines> record
  const {
    machine,
  }: {
    machine: Record<MachineType, Record<MachinePart, string>>;
  } = req.body;

  // Return null if the request couldn't be parsed
  if (!machine) {
    return {
      status: 400,
      error: 'Error, machine could not be parsed correctly',
    };
  }

  // Then, extract the machine's data from the <machine> records
  // and use that data to update it in the database
  try {
    for (const machineName in machine) {
      const machineType = machineName as MachineType;
      const machineParts = machine[machineType] as Record<MachinePart, string>;

      // Check if a machine with a matching <machineType> and <machineId>
      // exists in the database
      let machineRecordInDatabase;
      if (machineType === MachineType.AssemblyLine) {
        machineRecordInDatabase = await getPrismaClient().assemblyLine.findMany(
          {
            where: { id: machineId },
          }
        );
      } else if (machineType === MachineType.WeldingRobot) {
        machineRecordInDatabase = await getPrismaClient().weldingRobot.findMany(
          {
            where: { id: machineId },
          }
        );
      } else if (machineType === MachineType.PaintingStation) {
        machineRecordInDatabase = await getPrismaClient().assemblyLine.findMany(
          {
            where: { id: machineId },
          }
        );
      } else if (machineType === MachineType.QualityControlStation) {
        machineRecordInDatabase =
          await getPrismaClient().qualityControlStation.findMany({
            where: { id: machineId },
          });
      } else {
        // If the <machineType> wasn't recognized, log an error and return a 400 Bad Request response
        console.error(
          'Error: Unknown machine type:',
          machineType,
          'in editMachineData()'
        );
        return {
          status: 400,
          message: `Could not interpret machine with machineType '${machineType}'`,
        };
      }

      // If the <machineType> was recognized, but no matching machine was found in the database,
      // return a 400 Bad Request response
      if (!machineRecordInDatabase || machineRecordInDatabase.length !== 1) {
        return {
          status: 400,
          message: `Machine could not be found in database with machineType '${machineType}' and id '${machineId}'`,
        };
      }

      // Collect all the machine's parts and values into a JS object
      // we can use to update the machine in the database
      let partsToUpdate = {};
      for (const part in machineParts) {
        if (machineParts.hasOwnProperty(part)) {
          partsToUpdate = {
            [part]: getMachinePartValue(machineParts, part as MachinePart),
          };
        }
      }

      // Update the machine of type <machineType> and id <machineId>, with
      // the parts and values contained in <partsToUpdate>
      let updatedMachine;
      if (machineType === MachineType.AssemblyLine) {
        updatedMachine = await getPrismaClient().assemblyLine.update({
          where: { id: machineId },
          data: partsToUpdate,
        });
      } else if (machineType === MachineType.WeldingRobot) {
        updatedMachine = await getPrismaClient().weldingRobot.update({
          where: { id: machineId },
          data: partsToUpdate,
        });
      } else if (machineType === MachineType.PaintingStation) {
        updatedMachine = await getPrismaClient().paintingStation.update({
          where: { id: machineId },
          data: partsToUpdate,
        });
      } else {
        updatedMachine = await getPrismaClient().qualityControlStation.update({
          where: { id: machineId },
          data: partsToUpdate,
        });
      }

      // Return a success message with the <updatedMachine> data
      return {
        status: 200,
        message: 'Machine was updated successfully',
        updatedMachine: updatedMachine,
      };
    }

    // If we get to this line, that means the 'for' loop never ran, so return an error message
    return {
      status: 400,
      error:
        'Insufficient information provided to update machine, please reformat your request to have one machine, and one corresponding machine part to update',
    };
  } catch (error) {
    // If an unexpected error occurred, log an error and return a 500 Server Error Response
    console.error(
      'There was an error updating the machine in the database, error',
      error
    );
    return {
      status: 500,
      error:
        'There was an error updating the machine in the database, please try again later',
    };
  }
};
