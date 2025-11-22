import * as admin from 'firebase-admin'; 
import { initializeApp, getApps } from 'firebase-admin/app';
// We need getFirestore and FieldValue for database operations
import { getFirestore, FieldValue } from 'firebase-admin/firestore'; 
// Import Auth functionality for admin operations
import { getAuth } from 'firebase-admin/auth'; 


const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Only initialize the app if it hasn't been initialized already
if (!getApps().length) {
    try {
        initializeApp({
            credential: admin.credential.cert(serviceAccount), 
        });
        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("Firebase Admin initialization FAILED:", error);
    }
}

// Get the Firestore database instance
const adminDb = getFirestore();

// Get the Auth instance
const adminAuth = getAuth();

const updatePaymentStatus = async (orderId, tran_id, validationData) => {
    try {
        const orderRef = adminDb.collection('orders').doc(orderId);
        
        await orderRef.update({
            // Status update
            payment_status: 'Payment Successful',
            // Transaction metadata
            transactionId: tran_id,
            paymentDetails: validationData, // Save the full verified response
            // Timestamp the update
            updatedAt: FieldValue.serverTimestamp(), 
        });
        console.log(`Order ${orderId} status updated to SUCCESS.`);
    } catch (error) {
        console.error(`Failed to update order ${orderId} in Firestore:`, error);
        throw new Error('Database update failed');
    }
};

async function fetchOrderDetails(orderId: string) {
    // ⚠️ IMPLEMENT THIS: Use Firebase Admin SDK to fetch the document
    const orderDoc = await admin.firestore().collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
        throw new Error(`Order with ID ${orderId} not found.`);
    }

    const data = orderDoc.data();
    
    return {
        email: data.customerEmail, // Adjust field names to match your schema
        fullName: data.customerName,
        totalPrice: data.amount,
        address: data.shippingAddress,
        phone: data.customerPhone,
        paymentMethod: data.paymentMethod,
    };
}

// Export all necessary utilities: DB, Auth, and the payment function
export { adminDb, adminAuth, updatePaymentStatus, fetchOrderDetails };