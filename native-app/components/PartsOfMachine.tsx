import React, { useCallback, useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, TextInput } from 'react-native';

import { Text, View } from './Themed';
import axios from 'axios';
import Constants from 'expo-constants';
import RNPickerSelect from 'react-native-picker-select';
import machineData from '../data/machineData.json';
import { MachineType } from '../data/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMachineData } from '../app/useMachineData';
import { useFocusEffect } from 'expo-router';

export const PartsOfMachine = ({
  machineName,
  parts,
}: {
  machineName: string;
  parts: Record<string, string | number>;
}) => {
  return (
    <>
      {parts && (
        <>
          <Text style={styles.title}>{machineName}</Text>

          {/* Show Part Names and Values */}
          {Object.keys(parts).map((key) => {
            // Don't show the 'dateCreated' field, or any fields
            // whose value is 0
            if (key !== 'dateCreated' && parts[key] !== 0) {
              return (
                <Text key={key}>
                  {key}: {parts[key]}
                </Text>
              );
            }
          })}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
