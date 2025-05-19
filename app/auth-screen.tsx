// AuthScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../constants/firebaseConfig'; // Ensure Firebase is initialized
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup form
  const [error, setError] = useState('');
  const router = useRouter(); // To navigate to different screens

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('../../app/(tabs)/index'); // Redirect to the index page
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('../../app/(tabs)/index'); // Redirect to the index page
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and signup form
    setError(''); // Clear error message when toggling
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isLogin ? 'Login' : 'Signup'}</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title={isLogin ? 'Login' : 'Signup'} onPress={isLogin ? handleLogin : handleSignup} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.toggleText} onPress={toggleForm}>
        {isLogin ? 'Do not have an account? Sign up' : 'Already have an account? Log in'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleText: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 10,
    fontSize: 16,
  },
});
