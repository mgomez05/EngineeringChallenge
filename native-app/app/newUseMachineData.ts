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

  return {
    machineData,
    loadMachineData,
    resetMachineData,
  };
};
