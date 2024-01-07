import { Platform } from 'react-native';

// Initialize the api url with a default url
let apiUrl: string =
  'https://fancy-dolphin-65b07b.netlify.app/api/machine-health';

// Returns the api url for local development if this app is run in development
//   - The development url returned depends on whether the platform is android or ios
// Otherwise, returns the default url, shown above
export const getApiUrl = () => {
  if (__DEV__) {
    apiUrl = `http://${
      Platform?.OS === 'android' ? '10.0.2.2' : 'localhost'
    }:3001`;
  }

  return apiUrl;
};
