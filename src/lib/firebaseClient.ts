import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 1. IMPORT getAuth HERE
import { getAuth } from "firebase/auth";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. INITIALIZE and EXPORT Auth
export const auth = getAuth(app); // <-- Add this line

// Initialize and Export Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional)
// const analytics = getAnalytics(app); 

// Export Firestore utility functions
export const updateOrderStatus = async (orderId, newStatus) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
        status: newStatus,
    });
};

export const deleteOrder = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await deleteDoc(orderRef);
};