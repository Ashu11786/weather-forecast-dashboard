// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC_Oq217L_m5G7Pjo1tUS_T6WMbrObjaM",
  authDomain: "weather-forecast-dashboa-9fc52.firebaseapp.com",
  projectId: "weather-forecast-dashboa-9fc52",
  storageBucket: "weather-forecast-dashboa-9fc52.firebasestorage.app",
  messagingSenderId: "501687278177",
  appId: "1:501687278177:web:0a4d2cf09b70f4760a2820",
  measurementId: "G-G1RVP5T14W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);