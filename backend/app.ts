import express, { Request, Response } from 'express';
import { getMachineHealth } from './machineHealth';
import {
  getAllMachines,
  insertMachineDataToDatabase,
} from './addMachineHealthToDatabase';

import { getMachineHealthAllMachines } from './getMachineHealth';

const app = express();
const port = 3001;

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to get machine health score
// app.post('/machine-health', (req: Request, res: Response) => {
//   const result = getMachineHealth(req);
//   if (result.error) {
//     res.status(400).json(result);
//   } else {
//     res.json(result);
//   }
// });

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
    res.status(400).json(result);
  } else {
    res.json(result);
  }
});

app.listen(port, () => {
  console.log(`API is listening at http://localhost:${port}`);
});
