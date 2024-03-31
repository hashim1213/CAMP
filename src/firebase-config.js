import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 
// import { getAnalytics } from 'firebase/analytics'; // Uncomment if you use Analytics

const firebaseConfig = {
  apiKey: "AIzaSyBovBzScC2cVG4UBTjZw-Y0NwlZTeFMwo4",
  authDomain: "cropscout-98626.firebaseapp.com",
  projectId: "cropscout-98626",
  storageBucket: "cropscout-98626.appspot.com",
  messagingSenderId: "814250976762",
  appId: "1:814250976762:web:5d8d776f0ea159a94ab043",
  measurementId: "G-Z740JQ6DZE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 
//const analytics = getAnalytics(app); // Uncomment if you use Analytics

export { auth }; // Export Auth for authentication
export {db}; // Export Database for Firestore 