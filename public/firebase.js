// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt-XXfA7LXcIidCypOhC62QQuWWCFMf58",
  authDomain: "stocky-cdd1f.firebaseapp.com",
  projectId: "stocky-cdd1f",
  storageBucket: "stocky-cdd1f.firebasestorage.app",
  messagingSenderId: "678654264505",
  appId: "1:678654264505:web:0eb1847856c5d460014768",
  measurementId: "G-JD230DMV6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };