// Firebase initialization and exports
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDuEzZk7GFMPf-P7kDI3rwScxXTSapQfq8',
  authDomain: 'credexis-c0e34.firebaseapp.com',
  projectId: 'credexis-c0e34',
  storageBucket: 'credexis-c0e34.appspot.com', // fixed
  messagingSenderId: '508247199649',
  appId: '1:508247199649:web:626db2b74eabc8f19345e0',
  measurementId: 'G-NWTRVR0QDD',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage }; 