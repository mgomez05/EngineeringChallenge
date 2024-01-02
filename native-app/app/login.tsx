import { Button, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = {
  input: {
    padding: 10,
  },
};

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const insets = useSafeAreaInsets();

  const loginUser = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Logged in user successfully:', user);
        router.replace('/(tabs)');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(
          'Failed to login new user, error:',
          errorCode,
          errorMessage
        );
      });
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ textAlign: 'center' }}>Login Screen</Text>
        <TextInput
          style={styles.input}
          value={email}
          placeholder={'Username'}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          value={password}
          placeholder={'Password'}
          secureTextEntry
          onChangeText={setPassword}
        />
        <Button title='Login' onPress={loginUser} />
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <Text>
            Don't have an account yet?{' '}
            <Text
              onPress={() => {
                router.replace('/');
              }}
              style={{ color: '#2196F3', fontWeight: 'bold' }}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
