import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../constants/firebaseConfig";

interface Capsule {
  id: string;
  title: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

export default function Capsules() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "capsules"));
        const fetchedCapsules = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            coordinate: {
              latitude: data.location?.latitude,
              longitude: data.location?.longitude,
            },
          };
        });
        setCapsules(fetchedCapsules);
      } catch (error) {
        console.error("Error fetching capsules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4b6e7d" />
        <Text>Loading capsules...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗺️ Capsule Map</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude:
            capsules.length > 0 &&
            capsules[0].coordinate &&
            typeof capsules[0].coordinate.latitude === 'number'
              ? capsules[0].coordinate.latitude
              : 20.5937, 
          longitude:
            capsules.length > 0 &&
            capsules[0].coordinate &&
            typeof capsules[0].coordinate.longitude === 'number'
              ? capsules[0].coordinate.longitude
              : 78.9629,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
        
        
      >
        {capsules.map((capsule) => (
          <Marker
            key={capsule.id}
            coordinate={capsule.coordinate}
            title={capsule.title}
          >
            <Callout>
              <Text>{capsule.title}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4b6e7d",
    textAlign: "center",
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
