import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAOXevWGdsi3HKLL0uH-km-IMXwFvYayac",
  authDomain: "admtime-b4811.firebaseapp.com",
  projectId: "admtime-b4811",
  storageBucket: "admtime-b4811.appspot.com",
  messagingSenderId: "735261804473",
  appId: "1:735261804473:web:5cd00dedbbf9ae02ea1868"
};

const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);