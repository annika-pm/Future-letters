import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { db } from '../../constants/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import MapView, { Marker } from 'react-native-maps';
import * as Notifications from 'expo-notifications';
import type { NotificationTriggerInput, TimeIntervalTriggerInput } from 'expo-notifications';
export default function IndexScreen() {
  const [capsules, setCapsules] = useState<any[]>([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const router = useRouter();

  const fetchCapsules = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'capsules'));
      const fetchedCapsules: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCapsules.push({ ...doc.data(), id: doc.id });
      });
      setCapsules(fetchedCapsules);

      // Schedule notifications
      for (const capsule of fetchedCapsules) {
        const unlockDate = capsule.unlockDate?.toDate ? capsule.unlockDate.toDate() : new Date(capsule.unlockDate);
        const notifyDate = new Date(unlockDate);
        notifyDate.setDate(notifyDate.getDate() - 1); // 1 day before
        const secondsUntilNotify = Math.floor((notifyDate.getTime() - new Date().getTime()) / 1000);
        if (secondsUntilNotify > 0) {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `Capsule "${capsule.title}" unlocks soon!`,
                body: 'Open the app tomorrow to check it out.',
              },
              trigger: {
                ...( { type: 'timeInterval', seconds: secondsUntilNotify, repeats: false } as TimeIntervalTriggerInput )
              },
            });
          } catch (error) {
            console.error('Failed to schedule notification:', error);
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching capsules:', error.message);
        Alert.alert('Error', error.message || 'Something went wrong.');
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCapsules();
    }, [])
  );

  useEffect(() => {
    if (capsules.length > 0 && capsules[0].location) {
      const { latitude, longitude } = capsules[0].location;
      setMapRegion({
        ...mapRegion,
        latitude,
        longitude,
      });
    }
  }, [capsules]);

  const handleCapsuleClick = (capsule: any) => {
    const now = new Date();
    const unlockDate = capsule.unlockDate?.toDate ? capsule.unlockDate.toDate() : new Date(capsule.unlockDate);

    if (now >= unlockDate) {
      router.push({
        pathname: '/capsuledetail',
        params: {
          title: capsule.title,
          message: capsule.message,
          date: unlockDate.toDateString(),
        },
      });
    } else {
      Alert.alert('Capsule Locked', `This capsule will unlock on ${unlockDate.toDateString()}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Time Capsules</Text>

      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
      >
        {capsules.map((capsule) =>
          capsule.location ? (
            <Marker
              key={capsule.id}
              coordinate={{
                latitude: capsule.location.latitude,
                longitude: capsule.location.longitude,
              }}
              title={capsule.title}
              onPress={() => handleCapsuleClick(capsule)}
            />
          ) : null
        )}
      </MapView>

      {capsules.length === 0 ? (
        <View style={styles.noCapsulesContainer}>
          <Text style={styles.noCapsulesText}>No capsules created yet.</Text>
        </View>
      ) : (
        <FlatList
          data={capsules}
          renderItem={({ item }) => (
            <View style={styles.capsuleCard}>
              <Text
                style={styles.capsuleTitle}
                onPress={() => handleCapsuleClick(item)}
              >
                {item.title}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f9fc',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5d9b9e',
    textAlign: 'center',
    marginBottom: 30,
    paddingTop: 30,
  },
  map: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  noCapsulesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  noCapsulesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  capsuleCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  capsuleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5d9b9e',
  },
});