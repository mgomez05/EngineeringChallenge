import { Button, Platform, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Link, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { useCallback } from 'react';
import { PartsOfMachine } from '../../components/PartsOfMachine';
import { MachineScore } from '../../components/MachineScore';
import { newUseMachineData } from '../newUseMachineData';

let apiUrl: string =
  'https://fancy-dolphin-65b07b.netlify.app/api/machine-health';

if (__DEV__) {
  apiUrl = `http://${
    Platform?.OS === 'android' ? '10.0.2.2' : 'localhost'
  }:3001/machine-health`;
}

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
  const { machineData, loadMachineData } = newUseMachineData();

  // Doing this because we're not using central state like redux
  useFocusEffect(
    useCallback(() => {
      loadMachineData();
    }, [])
  );

  // const calculateHealth = useCallback(async () => {
  //   try {
  //     const response = await axios.post(apiUrl, {
  //       machines: machineData?.machines,
  //     });

  //     if (response.data?.factory) {
  //       setScores(response.data);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     console.log(
  //       `There was an error calculating health. ${
  //         error.toString() === 'AxiosError: Network Error'
  //           ? 'Is the api server started?'
  //           : error
  //       }`
  //     );
  //   }
  // }, [machineData]);

  const renderMachine = (machine) => {
    if (isWeldingRobot(machine)) {
      return <PartsOfMachine machineName={'Welding Robot'} parts={machine} />;
    } else if (isAssemblyLine(machine)) {
      return <PartsOfMachine machineName={'Assembly Line'} parts={machine} />;
    } else if (isPaintingStation(machine)) {
      return (
        <PartsOfMachine machineName={'Painting Station'} parts={machine} />
      );
    } else if (isQualityControlStation(machine)) {
      return (
        <PartsOfMachine
          machineName={'Quality Control Station'}
          parts={machine}
        />
      );
    } else return <></>;
  };

  return (
    <View style={styles.container}>
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
          {/* Render Each Machine in the list of machines */}
          {machineData.map((machine) => renderMachine(machine))}
          <View
            style={styles.separator}
            lightColor='#eee'
            darkColor='rgba(255,255,255,0.1)'
          />
          {/* Show the Factor Health Score */}
          <Text style={styles.title}>Factory Health Score</Text>
          <Text style={styles.text}>
            {machineData?.scores?.factory
              ? machineData?.scores?.factory
              : 'Not yet calculated'}
          </Text>
          {machineData?.scores?.machineScores && (
            <>
              <Text style={styles.title2}>Machine Health Scores</Text>
              {Object.keys(machineData?.scores?.machineScores).map((key) => (
                <MachineScore
                  key={key}
                  machineName={key}
                  score={machineData?.scores?.machineScores[key]}
                />
              ))}
            </>
          )}
        </>
      )}
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <Button
        title='Calculate Health'
        //onPress={calculateHealth}
      />
      <View style={styles.resetButton}>
        <Button
          title='Reset Machine Data'
          //onPress={async () => await resetMachineData()}
          color='#FF0000'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
