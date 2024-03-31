import {initializeApp} from "firebase/app";

import {getFirestore} from "firebase/firestore";
import {browserLocalPersistence, getAuth} from "firebase/auth";

export const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
export const AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
export const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
export const MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
export const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
export const MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// if (!API_KEY || !AUTH_DOMAIN || !PROJECT_ID || !STORAGE_BUCKET || !MESSAGING_SENDER_ID || !APP_ID || !MEASUREMENT_ID) {
//     throw new Error('Missing firebase config values');
// }


const firebaseConfig = {
  apiKey: "AIzaSyCF3KUlF4WQ5wmfqOZ5YVfR6v6goukheAs",
  authDomain: "bisonbytes-d90c2.firebaseapp.com",
  projectId: "bisonbytes-d90c2",
  storageBucket: "bisonbytes-d90c2.appspot.com",
  messagingSenderId: "943169287430",
  appId: "1:943169287430:web:f2710d9302f7a133aeda87",
  measurementId: "G-7PFJFE0DN1"
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);
// const analytics = getAnalytics(app);
export const auth = getAuth(firebase_app);
auth.setPersistence(browserLocalPersistence);
