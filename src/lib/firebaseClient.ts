import { initializeApp } from "firebase/app";

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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const updateOrderStatus = async (
  orderId: string,
  newStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: newStatus,
  });
};

export const deleteOrder = async (orderId: string) => {
  const orderRef = doc(db, "orders", orderId);
  await deleteDoc(orderRef);
};
