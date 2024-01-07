import { Button, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const insets = useSafeAreaInsets();

  // Creates a user in firebase using the <email> and <password> entered by the user
  // If the registration fails, logs an error message
  const createUser = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Created new user successfully:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(
          'Failed to create new user, error:',
          errorCode,
          errorMessage
        );
      });
  };

  // Listen for changes to the user's auth state
  // - If the user is signed in, navigate to the machine health page
  //    - NOTE: The user is considered signed in immediately after registering,
  //            OR if they've registered / logged in to the app before
  // - Otherwise, if the user hasn't signed in, keep them here on the registration page
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in, in _layout.tsx', user.email);
        router.push('/(tabs)');
      } else {
        console.log('user is logged out, in _layout.tsx');
      }
    });
  }, []);

  const styles = {
    input: {
      padding: 10,
    },
  };

  return (
    // Add SafeArea padding to this view, so that the registration
    // screen is only shown in the SafeArea of the device
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ textAlign: 'center' }}>Register Screen</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          value={email}
          placeholder={'Email'}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          value={password}
          placeholder={'Password'}
          secureTextEntry
          onChangeText={setPassword}
        />

        {/* Register Buttossn */}
        <Button title='Register' onPress={createUser} />

        {/* Button for navigating to Login Screen */}
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text>
            Already have an account?{' '}
            <Text
              onPress={() => {
                router.replace('/login');
              }}
              style={{ color: '#2196F3', fontWeight: 'bold' }}
            >
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
