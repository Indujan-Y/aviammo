import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPP0WVfL1-BM_OkeYeE4E6BK8hWYUMPh8",
  authDomain: "brewberrycafe-12a1f.firebaseapp.com",
  databaseURL: "https://brewberrycafe-12a1f-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "brewberrycafe-12a1f",
  storageBucket: "brewberrycafe-12a1f.appspot.com",
  messagingSenderId: "71995776402",
  appId: "1:71995776402:web:9a15fbbedb4d5963c7754b",
  measurementId: "G-8MGMJHQ47C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
