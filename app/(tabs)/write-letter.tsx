import * as DocumentPicker from 'expo-document-picker';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../constants/firebaseConfig';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Text, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  TouchableOpacity 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

interface WriteLetterProps {
  navigation: any;
}

const WriteLetter: React.FC<WriteLetterProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState(new Date());
  const [arObjectUri, setArObjectUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState<string | false>(false);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You need to grant location permission to use this feature.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });
    };

    getLocation();

    // Request notification permissions
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You need to grant notification permission to schedule capsules.');
      }
    };

    requestNotificationPermission();
  }, []);

  const selectArObject = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'application/*' });
    if (result.type === 'success') {
      const fileUri = result.uri;
      const fileExtension = fileUri.split('.').pop();
      const storageRef = ref(storage, `arObjects/${title}.${fileExtension}`);
      const response = await fetch(fileUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const fileUrl = await getDownloadURL(storageRef);
      setArObjectUri(fileUrl);
      Alert.alert('File uploaded successfully');
    }
  };

  const scheduleNotification = async (capsuleTitle: string, capsuleMessage: string, date: Date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Capsule: ${capsuleTitle}`,
        body: capsuleMessage,
        data: { capsuleTitle, capsuleMessage },
      },
      trigger: date as any,
    });
  };

  const saveCapsule = async () => {
    if (!title || !message || !unlockDate || !location || !recipientEmail || !scheduledTime) {
      Alert.alert('Error', 'Please fill in all the fields before saving the capsule.');
      return;
    }

    try {
      // Save capsule data in Firestore
      await addDoc(collection(db, 'capsules'), {
        title,
        message,
        unlockDate: unlockDate.toISOString(),
        arObjectUri,
        location,
        recipientEmail,
        scheduledTime: scheduledTime.toISOString(),
        createdAt: new Date().toISOString(),
      });

      // Schedule notification
      await scheduleNotification(title, message, scheduledTime);

      Alert.alert('Success', 'Capsule saved and scheduled!');
      setTitle('');
      setMessage('');
      setArObjectUri(null);
      setLocation(null);
      setRecipientEmail('');
      setScheduledTime(new Date());
      
     
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error saving capsule:', error.message);
        Alert.alert('Error', error.message || 'Something went wrong.');
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || unlockDate;
    setShowDatePicker(false);
    setUnlockDate(currentDate);
  };

  const onScheduledDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || scheduledTime;
    setShowDatePicker(false);
    setScheduledTime(currentDate);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.heading}>Create Your Time Capsule</Text>

            <View style={styles.card}>
              <TextInput
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
            </View>

            <View style={styles.card}>
              <TextInput
                placeholder="Message"
                value={message}
                onChangeText={setMessage}
                multiline
                style={[styles.input, { height: 120 }]}
              />
            </View>

            <View style={styles.card}>
              <TextInput
                placeholder="Recipient Email"
                value={recipientEmail}
                onChangeText={setRecipientEmail}
                style={styles.input}
              />
            </View>

            <View style={styles.card}>
              <TouchableOpacity style={styles.arButton} onPress={selectArObject}>
                <Text style={styles.buttonText}>Select AR Object</Text>
              </TouchableOpacity>
              {arObjectUri && (
                <View style={styles.arObjectContainer}>
                  <Text style={styles.arObjectText}>AR Object Selected:</Text>
                  <Image source={{ uri: arObjectUri }} style={styles.arObjectImage} />
                </View>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Unlock Date:</Text>
              <TouchableOpacity onPress={() => setShowDatePicker('unlock')} style={styles.dateButton}>
                <Text style={styles.dateText}>{unlockDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Scheduled Time to Send:</Text>
              <TouchableOpacity onPress={() => setShowDatePicker('scheduled')} style={styles.dateButton}>
                <Text style={styles.dateText}>{scheduledTime.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <TouchableOpacity style={styles.saveButton} onPress={saveCapsule}>
                <Text style={styles.buttonText}>Save Capsule</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={showDatePicker === 'unlock' ? unlockDate : scheduledTime}
              mode="date"
              display="default"
              onChange={showDatePicker === 'unlock' ? onDateChange : onScheduledDateChange}
            />
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f9fc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5d9b9e',
    textAlign: 'center',
    marginBottom: 30,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#f0f9f9',
    fontSize: 16,
    borderColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    color: '#5d9b9e',
    marginVertical: 10,
  },
  arObjectContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  arObjectText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  arObjectImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#b3d9d9',
    borderRadius: 12,
    marginTop: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
  },
  arButton: {
    backgroundColor: '#b3d9d9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#b3d9d9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WriteLetter;
