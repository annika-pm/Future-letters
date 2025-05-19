// constants/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // ✅ use getAuth only
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD2cw03n-5JPZ4AhBQ4kWYQseYRAjymv7U",
  authDomain: "futureletter-7e62a.firebaseapp.com",
  projectId: "futureletter-7e62a",
  storageBucket: "futureletter-7e62a.appspot.com",
  messagingSenderId: "403643836757",
  appId: "1:403643836757:web:bfae21fe59b1e9dd6e27dc",
  measurementId: "G-EM8RVPYXZR",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ No initializeAuth, no persistence setup — works with Expo Go
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage, app };
