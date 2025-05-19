import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const capsuledetails = () => {
  const router = useRouter();  // Accessing the router to navigate
  const { id } = useLocalSearchParams();  // Accessing dynamic parameter using useLocalSearchParams

  // State to manage capsule data, loading status, and errors
  const [capsule, setCapsule] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetching capsule details based on the ID when the component mounts or the ID changes
  useEffect(() => {
    if (!id) {
      setError('Capsule ID is missing');
      setLoading(false);
      return;
    }

    const fetchCapsuleDetail = async () => {
      try {
        const docRef = doc(db, 'capsules', id as string);  // Firestore document reference
        const docSnap = await getDoc(docRef);  // Fetch the document

        if (docSnap.exists()) {
          setCapsule(docSnap.data());  // If found, set the capsule data
        } else {
          setError('No capsule found with this ID');
        }
      } catch (err) {
        setError('Error fetching capsule details');
      } finally {
        setLoading(false);
      }
    };

    fetchCapsuleDetail();
  }, [id]);  // The useEffect will run whenever the 'id' changes

  // Loading state: Display a spinner while data is loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4b6e7d" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Error state: Display error message if something went wrong
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Display the capsule details if available
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Capsule Detail</Text>
      {capsule ? (
        <>
          <Text style={styles.title}>{capsule.title}</Text>
          <Text style={styles.message}>{capsule.message}</Text>
          <Text style={styles.date}>Unlocks on: {new Date(capsule.unlockDate).toLocaleDateString()}</Text>
        </>
      ) : (
        <Text>No capsule data available</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Back to List" onPress={() => router.back()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4b6e7d',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#336B87',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: '#7a8a98',
    marginBottom: 20,
    lineHeight: 22,
  },
  date: {
    fontSize: 14,
    color: '#a2a2a2',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f9',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f9',
  },
});

export default capsuledetails;
