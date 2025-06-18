// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyB3xHSECSWVn-eBBHzFX8SQCQNomYFOAeU",
  authDomain: "mood-based-recommendatio-2c7a9.firebaseapp.com",
  projectId: "mood-based-recommendatio-2c7a9",
  storageBucket: "mood-based-recommendatio-2c7a9.firebasestorage.app",
  messagingSenderId: "319741143296",
  appId: "1:319741143296:web:962498ff41379d436e2be5",
  measurementId: "G-GHXHXTBFMF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
