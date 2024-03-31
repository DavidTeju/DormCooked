// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional





// Import the functions you need from the SDKs you need
// import {getApps, initializeApp} from "firebase/app";
// import {getAnalytics} from "firebase/analytics";
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
    apiKey: "AIzaSyAl3k2Hrr-gJubrhOWcSNcixk0wPwRTUjw",
       authDomain: "dorm-cooked-meals.firebaseapp.com",
       projectId: "dorm-cooked-meals",
       storageBucket: "dorm-cooked-meals.appspot.com",
       messagingSenderId: "842791819381",
       appId: "1:842791819381:web:9952b11fd9dcb05c6dc03c",
       measurementId: "G-BRRVMNJHFX"
     };

// export const firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(firebase_app).setPersistence(browserLocalPersistence);
