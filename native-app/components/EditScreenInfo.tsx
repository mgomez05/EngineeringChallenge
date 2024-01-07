import React, { useCallback, useState } from 'react';
import { Button, Platform, StyleSheet, TextInput } from 'react-native';

import { Text, View } from './Themed';
import {
  AssemblyLinePart,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart,
} from '../data/types';
import { useFocusEffect } from 'expo-router';
import Picker from './Picker';
import Slider from '@react-native-community/slider';
import { newUseMachineData } from '../app/useMachineDataFromAPI';

export default function EditScreenInfo({ path }: { path: string }) {
  const [machineName, setMachineName] = useState('');
  const [partName, setPartName] = useState('');
  const [partValue, setPartValue] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const { machineData, loadMachineData, editMachineData } = newUseMachineData();
  const [sliderValue, setSliderValue] = useState(0);
  const [machineId, setMachineId] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const machineNames = [
    { label: 'Welding Robot', value: MachineType.WeldingRobot },
    { label: 'PaintingStation', value: MachineType.PaintingStation },
    { label: 'Assembly Line', value: MachineType.AssemblyLine },
    {
      label: 'Quality Control Station',
      value: MachineType.QualityControlStation,
    },
  ];

  const partNames = [
    { value: 'arcStability', label: 'Arc Stability' },
    {
      value: 'coolingEfficiency',
      label: 'Cooling Efficiency',
    },
    { value: 'electrodeWear', label: 'Electrode Wear' },
    { value: 'seamWidth', label: 'Seam Width' },
    {
      value: 'shieldingPressure',
      label: 'Shielding Pressure',
    },
    { value: 'vibrationLevel', label: 'Vibration Level' },
    { value: 'wireFeedRate', label: 'Wire Feed Rate' },
    {
      value: 'colorConsistency',
      label: 'Color Consistency',
    },
    { value: 'flowRate', label: 'Flow Rate' },
    {
      value: 'nozzleCondition',
      label: 'Nozzle Condition',
    },
    { value: 'pressure', label: 'Pressure' },
    {
      value: 'alignmentAccuracy',
      label: 'Alignment Accuracy',
    },
    { value: 'beltSpeed', label: 'Belt Speed' },
    {
      value: 'fittingTolerance',
      label: 'Fitting Tolerance',
    },
    { value: 'speed', label: 'Speed' },
    {
      value: 'cameraCalibration',
      label: 'Camera Calibration',
    },
    {
      value: 'criteriaSettings',
      label: 'Criteria Settings',
    },
    {
      value: 'lightIntensity',
      label: 'Light Intensity',
    },
    {
      value: 'softwareVersion',
      label: 'Software Version',
    },
  ];

  //Doing this because we're not using central state like redux
  useFocusEffect(
    useCallback(() => {
      loadMachineData();
    }, [])
  );

  // Translate the slider's value into a meaningfully-named variable
  const isNewMachinePart = sliderValue === 0;

  const allFieldsFilled = () => {
    if (partName && partValue && machineName) {
      if (isNewMachinePart) {
        return true;
      } else {
        return machineId !== '';
      }
    }
  };

  // Returns true if <partName> is a valid part for machineType <machineName>
  // Otherwise returns false
  const isValidPartForMachineType = () => {
    let isRobotPartValid = false;
    if (machineName === MachineType.WeldingRobot) {
      Object.values(WeldingRobotPart).forEach((validPart) => {
        console.log('current part', validPart, '===?', partName);
        if (validPart === partName) {
          isRobotPartValid = true;
          return;
        }
      });
    } else if (machineName === MachineType.PaintingStation) {
      Object.values(PaintingStationPart).forEach((validPart) => {
        console.log('current part', validPart, '===?', partName);
        if (validPart === partName) {
          isRobotPartValid = true;
          return;
        }
      });
    } else if (machineName === MachineType.QualityControlStation) {
      Object.values(QualityControlStationPart).forEach((validPart) => {
        console.log('current part', validPart, '===?', partName);
        if (validPart === partName) {
          isRobotPartValid = true;
          return;
        }
      });
    } else if (machineName === MachineType.AssemblyLine) {
      Object.values(AssemblyLinePart).forEach((validPart) => {
        console.log('current part', validPart, '===?', partName);
        if (validPart === partName) {
          isRobotPartValid = true;
          return;
        }
      });
    } else {
      console.error(
        'Invalid machineName',
        machineName,
        'provided in isValidPartForMachineType()'
      );
      return false;
    }

    return isRobotPartValid;
  };

  const savePart = async () => {
    // Show an error message if not all fields have been filled out
    if (!allFieldsFilled()) {
      setErrorMessage('Please fill out all fields');
      // Clear the message after 2 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }

    // Show an error message if the current <partName> isn't compatible
    // with the <machineName> currently selected by the user
    if (!isValidPartForMachineType()) {
      setErrorMessage('Please select a valid part for machine: ' + machineName);
      // Clear the message after 2 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }

    // Reset the save state and error state
    // (in case the user attempts to log more than one part on this screen)
    setIsSaved(false);
    setErrorMessage('');

    try {
      // Convert the gathered data into a machine data object for populating the request body
      const machineData = {
        [machineName]: {
          [partName]: partValue,
        },
      };

      // Send the update / create new machine request
      const updateSucceeded = await editMachineData(
        isNewMachinePart ? '' : machineId,
        machineData
      );

      // Show a 'Saved' message if the update or creating succeeded
      // Otherwise, show an error message depending on whether it was an update request or a 'create new machine' request
      if (updateSucceeded) {
        console.log('Machine updated / created successfully');
        setIsSaved(true);
      } else {
        console.log('Updating / creating machine failed');
        if (isNewMachinePart) {
          setErrorMessage('Failed to create new machine with part specified');
        } else {
          setErrorMessage('Failed to update machine with part specified');
        }
      }

      // Reset all fields and the save and error state after 2 seconds
      setTimeout(() => {
        setMachineName('');
        setPartName('');
        setPartValue('');
        setMachineId('');

        setIsSaved(false);
        setErrorMessage('');
      }, 2000);
    } catch (error) {
      console.error('Updating machine failed with error', error);
    }
  };

  // If <machineData> has been loaded and has at least one entry,
  // this returns a <Picker> that allows the user to select an id
  // from the ids found in <machineData>
  // Otherwise, returns an error <Text> with instructions
  const renderMachinePicker = () => {
    if (machineData && machineData.length > 0) {
      // Get all the machine ids from the array of machines in <machineData>
      const existingMachines = machineData.map((machine) => {
        return { value: machine.id, label: machine.id };
      });
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Select Machine Id</Text>
          <Picker
            value={machineId}
            onSetValue={setMachineId}
            items={existingMachines}
          />
        </View>
      );
    } else {
      return <Text>No machines exist yet, add a new machine first!</Text>;
    }
  };

  return (
    <View>
      <Text style={styles.label}>Machine Name</Text>
      <Picker
        value={machineName}
        onSetValue={setMachineName}
        items={machineNames}
      />
      <Text style={styles.label}>Part Name</Text>
      <Picker value={partName} onSetValue={setPartName} items={partNames} />
      <Text style={styles.label}>Part Value</Text>
      <TextInput
        style={styles.input}
        value={partValue}
        onChangeText={(text) => setPartValue(text)}
        placeholder='Enter part value'
      />

      {/* Choice: New Machine or Existing Machine */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>New Machine or Existing Machine</Text>
        <Slider
          style={{ width: 50, height: 40 }}
          value={sliderValue}
          onValueChange={setSliderValue}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor='#000000'
          maximumTrackTintColor='#000000'
        />
      </View>

      {/* Show Machine Id Picker if user is editing an existing machine */}
      {!isNewMachinePart && renderMachinePicker()}

      <Button
        // Change Button text depending on whether we're editing a part on an
        // existing machine, or adding a new machine's part
        title={
          isNewMachinePart
            ? 'Add Part to New Machine'
            : 'Set Part for Existing Machine'
        }
        onPress={savePart}
      />
      {/* Show Save Message if the savePart() function succeeded */}
      {isSaved && <Text style={styles.healthScore}>Saved ✔️</Text>}

      {/* Show Errorm Message if there was an error during the savePart() function */}
      {errorMessage && (
        <Text style={{ textAlign: 'center', color: 'red' }}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  healthScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
