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
  parts: Record<string, string>;
}) => {
  return (
    <>
      {parts && (
        <>
          <Text style={styles.title}>{machineName}</Text>
          {Object.keys(parts).map((key) => {
            if (key !== 'dateCreated' && key !== 'id') {
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
