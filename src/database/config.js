import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBQnYid2ajrRutxWw5XEtJfyvKCEC1rdQs",
    authDomain: "routesafetyapp-722e4.firebaseapp.com",
    projectId: "routesafetyapp-722e4",
    storageBucket: "routesafetyapp-722e4.firebasestorage.app",
    messagingSenderId: "821215308875",
    appId: "1:821215308875:web:18ed88594b43993325f1ce"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);