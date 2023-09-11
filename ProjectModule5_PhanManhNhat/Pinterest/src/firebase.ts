// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyns7NRMFLdJcDxU1g85GWFSoPUx8F3-Y",
  authDomain: "firsttimefirebase-46044.firebaseapp.com",
  projectId: "firsttimefirebase-46044",
  storageBucket: "firsttimefirebase-46044.appspot.com",
  messagingSenderId: "858225466630",
  appId: "1:858225466630:web:159c701cadd46bf4871287",
  measurementId: "G-D6M8FDGGKQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Storage and get a reference to the service
export const storageFirebase = getStorage(app);
