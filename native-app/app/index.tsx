import { Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('practice@user.com');
  const [password, setPassword] = useState('practicepassword');

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

  return (
    <View>
      <Text>Register Screen</Text>
      <Button title='Register' onPress={createUser} />
    </View>
  );
}
