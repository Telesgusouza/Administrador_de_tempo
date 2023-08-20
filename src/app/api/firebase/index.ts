import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyAOXevWGdsi3HKLL0uH-km-IMXwFvYayac",
//   authDomain: "admtime-b4811.firebaseapp.com",
//   projectId: "admtime-b4811",
//   storageBucket: "admtime-b4811.appspot.com",
//   messagingSenderId: "735261804473",
//   appId: "1:735261804473:web:5cd00dedbbf9ae02ea1868"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCZdTqeqVJqeZXDD6b4dFtz5JC1gvuP4hY",
  authDomain: "admtime-b732f.firebaseapp.com",
  projectId: "admtime-b732f",
  storageBucket: "admtime-b732f.appspot.com",
  messagingSenderId: "342440013614",
  appId: "1:342440013614:web:8400a8efe2d983489c94bf",
  measurementId: "G-0NNKXBLSQL"
};

const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
export const storage = getStorage(firebase);