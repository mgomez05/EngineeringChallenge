import { useState, useCallback } from 'react';
import { getApiUrl } from './utils';
import axios from 'axios';

export const newUseMachineData = () => {
  const [machineData, setMachineData] = useState(undefined);

  // Loads all machines from the database using the GET /machine endpoint
  //   - If the request succeeds, it sets the new machine data using setMachineData()
  //   - Otherwise, if the request fails, it sets the machine data to the empty array []
  const loadMachineData = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await axios.get(`${apiUrl}/machine`);

      if (response.status === 200) {
        const allMachines = response.data;
        setMachineData(allMachines);
      } else {
        console.error(
          'There was an error fetching the machine data, status code was',
          response.status
        );

        setMachineData([]);
      }
    } catch (error) {
      console.error('There was an error fetching the machine data', error);
      setMachineData([]);
    }
  }, []);

  // Sends a request to the DELETE /machine endpoint to remove all machines from the database
  // - Logs an error if the request fails
  //
  // After making the request, it reloads the machines from the database, regardless of whether
  // the request succeeded or failed
  const resetMachineData = async () => {
    const apiUrl = getApiUrl();
    const response = await axios.delete(`${apiUrl}/machine`);

    if (response.status === 200) {
      console.log('Machine data was reset successfully');
    } else {
      console.error(
        'There was an error resetting the machine data, status code was',
        response.status
      );
    }

    console.log('Reloading machine data after reset');
    await loadMachineData();
  };

  // Sends a request to the PUT /machine endpoint in order to
  // update an existing machine's part, or create a new machine's part
  //
  // - If <machineId> is the empty string, we attempt to create a new machine:
  //    - Returns true if the machine was created, and reloads the machines from the database
  //    - Otherwise returns false
  // -Otherwise, if <machineId> is non-empty, we attempt to update the machine with id <machineId>:
  //    - Returns true if the machine was updated, and reloads the machines from the database
  //    - Otherwise returns false
  const editMachineData = async (machineId: string, machineData: any) => {
    try {
      const apiUrl = getApiUrl();
      const response = await axios.put(`${apiUrl}/machine`, {
        machineId: machineId,
        machine: machineData,
      });

      // If the request succeeded, reload the machine data and return true
      // Otherwise, return false
      if (response.status === 200) {
        console.log('Machine was created / updated successfully');

        await loadMachineData();
        return true;
      } else {
        console.error(
          'There was an error creating / updating the machine data, status code was',
          response.status
        );
        return false;
      }
    } catch (error) {
      console.error('Failed to edit machine', error);
      return false;
    }
  };

  return {
    machineData,
    loadMachineData,
    resetMachineData,
    editMachineData,
  };
};
