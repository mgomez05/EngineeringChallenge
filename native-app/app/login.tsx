import { Button, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { router } from 'expo-router';

const styles = {
  input: {
    padding: 10,
  },
};

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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
    </View>
  );
}
