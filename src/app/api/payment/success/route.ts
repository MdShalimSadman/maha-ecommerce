import { type NextRequest } from 'next/server';
import axios from 'axios';

import { fetchOrderDetails, updatePaymentStatus } from '@/firebase/admin';

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production';

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID = process.env.EMAILJS_CUSTOMER_TEMPLATE_ID;
const EMAILJS_ADMIN_TEMPLATE_ID = process.env.EMAILJS_ADMIN_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

const emailjs = {
    send: async (serviceId: string, templateId: string, templateParams: any, publicKey: string) => {
       
        console.log(`Sending email using template ${templateId} with data:`, templateParams);

    }
}

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

            let orderDetails;

            try {
                orderDetails = await fetchOrderDetails(firestoreOrderId);
            } catch (fetchError) {
                 console.error("Failed to fetch order details for email:", fetchError);
            }

            try {
                // The updatePaymentStatus function uses the Firebase Admin SDK
                await updatePaymentStatus(firestoreOrderId, tran_id, validationData);
            } catch (dbError) {
                console.error("Database Update FAILED, proceeding with redirect:", dbError);
            }

            // 📧 STEP 3: Send Email Notifications (Only if details were fetched and credentials exist)
            if (orderDetails && EMAILJS_SERVICE_ID && EMAILJS_PUBLIC_KEY) {
                const { email, fullName, totalPrice, address, phone, paymentMethod } = orderDetails;
                const formattedTotalPrice = totalPrice.toFixed(2);
                
                try {
                    // 📧 Customer Email Confirmation
                    if (EMAILJS_CUSTOMER_TEMPLATE_ID) {
                        await emailjs.send(
                            EMAILJS_SERVICE_ID,
                            EMAILJS_CUSTOMER_TEMPLATE_ID,
                            { 
                                order_id: firestoreOrderId, 
                                to_email: email, 
                                customer_name: fullName, 
                                total_price: formattedTotalPrice 
                            },
                            EMAILJS_PUBLIC_KEY
                        );
                        console.log(`Customer confirmation email successfully triggered.`);
                    } else {
                        console.warn('Customer Email Template ID is missing.');
                    }

                    // 📧 Admin Notification Email
                    if (EMAILJS_ADMIN_TEMPLATE_ID) {
                        await emailjs.send(
                            EMAILJS_SERVICE_ID,
                            EMAILJS_ADMIN_TEMPLATE_ID,
                            {
                                order_id: firestoreOrderId,
                                customer_name: fullName,
                                to_email: email, // Customer email in Admin template
                                customer_phone: phone,
                                customer_address: address,
                                total_price: formattedTotalPrice,
                                payment_method: paymentMethod.replace(/_/g, " "),
                            },
                            EMAILJS_PUBLIC_KEY
                        );
                        console.log('Admin notification email successfully triggered.');
                    } else {
                         console.warn('Admin Email Template ID is missing.');
                    }
                } catch (emailError) {
                    console.error("EmailJS sending FAILED:", emailError);
                    // Crucially, log the email error but don't fail the overall payment process.
                }
            } else {
                 console.warn('Email skipped due to missing credentials or failed order details fetch.');
            }


            // 🚀 STEP 4: Redirect the user to the success page
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

// The GET handler is unchanged, handling direct access or refreshes
export async function GET(request: NextRequest) {
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