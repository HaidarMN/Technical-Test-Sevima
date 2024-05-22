import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlOOXC9kzlYuir4hEQ20wZGM60G4JvQC8",
  authDomain: "technical-test-sekawan.firebaseapp.com",
  projectId: "technical-test-sekawan",
  storageBucket: "technical-test-sekawan.appspot.com",
  messagingSenderId: "604205964925",
  appId: "1:604205964925:web:b874376b4e6cb9bf35db14",
};

const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);

export { firestoreDB };
