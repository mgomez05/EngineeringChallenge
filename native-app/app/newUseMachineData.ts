import { useState, useCallback } from 'react';
import { getApiUrl } from './utils';
import axios from 'axios';

export const newUseMachineData = () => {
  const [machineData, setMachineData] = useState(undefined);

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

  // If <machineId> is the empty string:
  //    - Returns true if the machine was created
  //    - Otherwise returns false
  // If <machineId> is non-empty:
  //    - Returns true if the machine was updated
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
