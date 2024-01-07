import { Button, Platform, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Link, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { PartsOfMachine } from '../../components/PartsOfMachine';
import { MachineScore } from '../../components/MachineScore';
import { newUseMachineData } from '../newUseMachineData';
import { getApiUrl } from '../utils';

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

export default function StateScreen() {
  const { machineData, loadMachineData, resetMachineData } =
    newUseMachineData();
  const [scores, setScores] = useState(null);

  // Load the machines from the server
  useFocusEffect(
    useCallback(() => {
      loadMachineData();
    }, [])
  );

  // Retrieve the machine scores and factory scores
  // from the server via the GET /machine-health endpoint
  //    - If the request succeeds, we set the scores using setScores()
  //    - If the request fails, we reset the scores to the empty list []
  const calculateHealth = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await axios.get(`${apiUrl}/machine-health`);

      if (response.data) {
        setScores(response.data);
      } else {
        setScores([]);
      }
    } catch (error) {
      console.log(
        `There was an error calculating health. ${
          error.toString() === 'AxiosError: Network Error'
            ? 'Is the api server started?'
            : error
        }`
      );
      setScores([]);
    }
  }, []);

  // Given one of the 4 machines provided by the server in a GET /machine request,
  // it returns that <machine> as a <PartsOfMachine> component
  // - If the machine type is not recognized, it returns <></>
  const renderMachine = (machine) => {
    if (isWeldingRobot(machine)) {
      return (
        <PartsOfMachine
          key={machine.id}
          machineName={'Welding Robot'}
          parts={machine}
        />
      );
    } else if (isAssemblyLine(machine)) {
      return (
        <PartsOfMachine
          key={machine.id}
          machineName={'Assembly Line'}
          parts={machine}
        />
      );
    } else if (isPaintingStation(machine)) {
      return (
        <PartsOfMachine
          key={machine.id}
          machineName={'Painting Station'}
          parts={machine}
        />
      );
    } else if (isQualityControlStation(machine)) {
      return (
        <PartsOfMachine
          key={machine.id}
          machineName={'Quality Control Station'}
          parts={machine}
        />
      );
    } else return <></>;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.separator} />
      {/* Show instructions for part logging if there are no machines loaded yet */}
      {!machineData && (
        <Link href='/two' style={styles.link}>
          <Text style={styles.linkText}>
            Please log a part to check machine health
          </Text>
        </Link>
      )}
      {machineData && (
        <>
          {/* Render Each Machine in the list of machines provided by the server */}
          {machineData.map((machine) => renderMachine(machine))}
          <View
            style={styles.separator}
            lightColor='#eee'
            darkColor='rgba(255,255,255,0.1)'
          />
          {/* Show the Factory Health Score */}
          <Text style={styles.title}>Factory Health Score</Text>
          <Text style={styles.text}>
            {scores?.factory ? scores?.factory : 'Not yet calculated'}
          </Text>
          {/* Show the Machine Scores */}
          {scores?.machineScores && (
            <>
              <Text style={styles.title2}>Machine Health Scores</Text>
              {scores.machineScores.map((score) => {
                return (
                  <MachineScore
                    key={score.machineTypeId}
                    machineName={score.machineType}
                    score={score.machineScore}
                  />
                );
              })}
            </>
          )}
        </>
      )}
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <Button title='Calculate Health' onPress={calculateHealth} />
      <View style={styles.resetButton}>
        <Button
          title='Reset Machine Data'
          onPress={async () => await resetMachineData()}
          color='#FF0000'
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  text: {},
  link: {
    paddingBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  resetButton: {
    marginTop: 10,
  },
});
