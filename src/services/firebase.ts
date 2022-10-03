// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-jDQzATl9Wg5Pedo5VRGS8j_8ZDmz_yo",
  authDomain: "boardapp-2e0dc.firebaseapp.com",
  projectId: "boardapp-2e0dc",
  storageBucket: "boardapp-2e0dc.appspot.com",
  messagingSenderId: "270718121084",
  appId: "1:270718121084:web:122aae55b1ac83517d45f9",
  measurementId: "G-HCLRXXL358"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);