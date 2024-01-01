import { Button, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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

  console.log('Current email and password:', email, ',', password);

  return (
    <View>
      <Text style={{ textAlign: 'center' }}>Register Screen</Text>
      <TextInput
        value={email}
        placeholder={'Username'}
        onChangeText={setEmail}
      />
      <TextInput
        value={password}
        placeholder={'Password'}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title='Register' onPress={createUser} />
    </View>
  );
}
