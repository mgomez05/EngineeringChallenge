import { Platform } from 'react-native';

let apiUrl: string =
  'https://fancy-dolphin-65b07b.netlify.app/api/machine-health';
export const getApiUrl = () => {
  if (__DEV__) {
    apiUrl = `http://${
      Platform?.OS === 'android' ? '10.0.2.2' : 'localhost'
    }:3001`;
  }

  return apiUrl;
};
