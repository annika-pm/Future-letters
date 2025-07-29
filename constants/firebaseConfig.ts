// constants/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // ✅ use getAuth only
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "API KEY",
  authDomain: "AUTH KEY",
  projectId: "PID",
  storageBucket: "St",
  messagingSenderId: "MSID",
  appId: "APPID",
  measurementId: "MID",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ No initializeAuth, no persistence setup — works with Expo Go
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage, app };
