import express, { Request, Response } from 'express';
import { getMachineHealth } from './machineHealth';
import {
  getAllMachines,
  insertMachineDataToDatabase,
} from './addMachinesToDatabase';

import { getMachineHealthAllMachines } from './getMachineHealth';
import { getPrismaClient } from './prismaUtils';
import { editMachineData } from './editMachineData';

const app = express();
const port = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to get machine health score of all machines in the database
app.get('/machine-health', async (req: Request, res: Response) => {
  console.log('In GET /machine-health');
  const result = await getMachineHealthAllMachines(req);
  return res.json(result);
});

// Returns all the machines in the database
app.get('/machine', async (req: Request, res: Response) => {
  console.log('In GET /machine');

  const allMachines = await getAllMachines();
  return res.json(allMachines);
});

// Inserts up to 4 machines into the database
app.post('/machine', async (req: Request, res: Response) => {
  console.log('In POST /machine');
  const result = await insertMachineDataToDatabase(req);
  if (!result) {
    res.status(400).json({
      error: 'Error, not all machines could be created in the database',
    });
  } else {
    res.json(result);
  }
});

// If a <machineId> is provided, updates that machine with the part data provided
// Otherwise, if no <machineId> is provided, adds a new machine and part to the database
app.put('/machine', async (req: Request, res: Response) => {
  console.log('In PUT /machine');
  const result = await editMachineData(req);

  if (result.status === 200) {
    res.status(result.status).json({
      message: 'Machine was created / updated successfully in the database',
      data: result,
    });
  } else {
    res.status(result.status).json({
      error: 'Error, machine could be created / updated in the database',
      data: result,
    });
  }
});

// Deletes all machines in the database
app.delete('/machine', async (req: Request, res: Response) => {
  console.log('In DELETE /machine');

  try {
    await getPrismaClient().assemblyLine.deleteMany();
    await getPrismaClient().paintingStation.deleteMany();
    await getPrismaClient().qualityControlStation.deleteMany();
    await getPrismaClient().weldingRobot.deleteMany();
    res
      .status(200)
      .json({ message: 'Successfully removed all machines from the database' });
  } catch (error) {
    console.error(
      'There was an error removing all machines from the database, please try again later'
    );

    res.status(500).json({
      error:
        'There was an error removing all machines from the database. Please try again later',
    });
  }
});

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
