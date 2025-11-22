import * as admin from 'firebase-admin'; 
import { initializeApp, getApps } from 'firebase-admin/app';
// We need getFirestore and FieldValue for database operations
import { getFirestore, FieldValue } from 'firebase-admin/firestore'; 
// Import Auth functionality for admin operations
import { getAuth } from 'firebase-admin/auth'; 
import { OrderDetails } from '@/types/order';


const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};


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

// --- 3. Get Service Instances ---

// Get the Firestore database instance
const adminDb = getFirestore();

// Get the Auth instance
const adminAuth = getAuth();


const updatePaymentStatus = async (orderId: string, tran_id: string, validationData: Record<string, any>) => {
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

/**
 * Fetches required details for a given order ID from Firestore.
 * @param orderId The unique ID of the order.
 * @returns An object containing key order details.
 */
async function fetchOrderDetails(orderId: string): Promise<OrderDetails> {
    // FIX: Use the 'adminDb' constant initialized with getFirestore()
    const orderDoc = await adminDb.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
        throw new Error(`Order with ID ${orderId} not found.`);
    }

    const data = orderDoc.data();
    
    if (!data) {
        throw new Error(`Order data for ID ${orderId} is empty.`);
    }
    
    // NOTE: Adjust field names (customerEmail, amount, etc.) to match your actual Firestore schema.
    return {
        email: data.email, 
        fullName: data.fullName,
        totalPrice: data.totalPrice,
        address: data.address,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
    } as OrderDetails; // Type casting for safety
}


// --- 5. Exports ---

// Export all necessary utilities: DB, Auth, and the payment functions
export { adminDb, adminAuth, updatePaymentStatus, fetchOrderDetails };