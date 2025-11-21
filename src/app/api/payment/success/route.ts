import { type NextRequest, NextResponse } from 'next/server';
import axios from 'axios'; 
// 💡 Import the update function from the server-side Admin setup
import { updatePaymentStatus } from '@/firebase/admin';

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production'; 

function getBaseUrl(request: NextRequest): string {
    const url = new URL(request.url);
    return url.origin; 
}

export async function POST(request: NextRequest) {
    const baseUrl = getBaseUrl(request); 

    if (!store_id || !store_passwd) {
        console.error('SSLCommerz credentials missing.');
        const errorUrl = `${baseUrl}/payment-failed?reason=config_error`;
        return new Response(null, { status: 303, headers: { 'Location': errorUrl } });
    }
    
    try {
        const formData = await request.formData();

        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value as string;
        });

        // CRITICAL: Extract the Firestore order ID from value_a
        const { val_id, tran_id, amount, value_a: firestoreOrderId } = data;

        if (!val_id || !tran_id || !amount || !firestoreOrderId) {
            console.error('Missing essential data in callback. Firestore ID (value_a) is missing.', data);
            const errorUrl = `${baseUrl}/payment-failed?reason=missing_data`;
            return new Response(null, { status: 303, headers: { 'Location': errorUrl } });
        }

        const validationUrl = is_live
            ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php`
            : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php`;

        const validationParams = new URLSearchParams({
            val_id: val_id,
            store_id: store_id,
            store_passwd: store_passwd,
            format: 'json',
        });

        const validationResponse = await axios.get(`${validationUrl}?${validationParams.toString()}`);
        const validationData = validationResponse.data;
        const status = validationData.status;

        if (status === 'VALID' || status === 'VALIDATED') {
            
            // 🚀 STEP 1: Update Firestore Order Status (Server-side operation)
            try {
                // The updatePaymentStatus function uses the Firebase Admin SDK
                await updatePaymentStatus(firestoreOrderId, tran_id, validationData);
            } catch (dbError) {
                console.error("Database Update FAILED, proceeding with redirect:", dbError);
                // Log the error but proceed with the success redirect
            }

            // 🚀 STEP 2: Redirect the user to the success page
            // Including both transactionId and orderId in the URL
            const successUrl = `${baseUrl}/payment-success?transactionId=${tran_id}&orderId=${firestoreOrderId}`;
            
            return new Response(null, {
                status: 303, 
                headers: { 'Location': successUrl },
            });
        } else {
            console.error('Payment validation failed:', validationData);
            // Redirect to a failed page, including IDs for tracking
            const failedUrl = `${baseUrl}/payment-failed?transactionId=${tran_id}&status=${status}&orderId=${firestoreOrderId}`;

            return new Response(null, {
                status: 303,
                headers: { 'Location': failedUrl }
            });
        }
    } catch (error) {
        console.error('Payment Success Handler Error:', error);
        const errorUrl = `${baseUrl}/payment/error`;

        return new Response(null, {
            status: 303, 
            headers: { 'Location': errorUrl }
        });
    }
}

export async function GET(request: NextRequest) {
    // This GET handler handles direct GET requests to the success route (e.g., if the user refreshes).
    // The POST handler above is the primary way the payment gateway sends data.
    const tran_id = request.nextUrl.searchParams.get('tran_id') || request.nextUrl.searchParams.get('transactionId');
    const order_id = request.nextUrl.searchParams.get('orderId');
    const status = request.nextUrl.searchParams.get('status');

    const baseUrl = getBaseUrl(request);

    let redirectUrl: string;

    if (tran_id && order_id && (status === 'Success' || status === 'DONE' || !status)) {
        // Redirect to success page with both IDs
        redirectUrl = `${baseUrl}/payment-success?transactionId=${tran_id}&orderId=${order_id}`;
    } else if (status === 'FAILED' || status === 'CANCELLED') {
        redirectUrl = `${baseUrl}/payment-failed?transactionId=${tran_id}&status=${status}&orderId=${order_id || ''}`;
    } else {
        redirectUrl = `${baseUrl}/payment/error`;
    }

    return new Response(null, {
        status: 303, 
        headers: { 'Location': redirectUrl }
    });
}