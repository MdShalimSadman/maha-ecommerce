// firebase/admin.js

// 👇 Import the entire firebase-admin package as 'admin'
import * as admin from 'firebase-admin'; 
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Ensure your environment variables for Firebase Admin are set
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!getApps().length) {
  initializeApp({
    // 👇 Now 'admin' is defined
    credential: admin.credential.cert(serviceAccount), 
  });
}

const adminAuth = getAuth();

export { adminAuth };