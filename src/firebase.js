import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = { apiKey: "AIzaSyBPxd8ag3HyPM6qywsDdpM-cgCXCdjWBVo",
  authDomain: "ssg-prototype.firebaseapp.com",
  projectId: "ssg-prototype",
  storageBucket: "ssg-prototype.firebasestorage.app",
  messagingSenderId: "661854012909",
  appId: "1:661854012909:web:1fd13f3d5cc29260e7d3e4",
  measurementId: "G-BD6BHD6F0J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
