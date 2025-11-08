// app/api/payment/success/route.js
import { NextResponse } from 'next/server';

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
const is_live = false;

export async function POST(request) {
    try {
        // SSLCommerz sends data as form data, not JSON
        const formData = await request.formData();
        
        // Convert FormData to object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log('Payment Success Data:', data);

        const {
            val_id,
            tran_id,
            amount,
            card_type,
            status,
            tran_date,
            currency,
            card_issuer,
            card_brand,
            card_no,
            bank_tran_id,
            store_amount,
            verify_sign,
            verify_key,
            risk_level,
            risk_title
        } = data;

        // Validate the payment with SSLCommerz
        const validationUrl = is_live
            ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
            : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`;

        const validationResponse = await fetch(validationUrl);
        const validationData = await validationResponse.json();

        console.log('Validation Response:', validationData);

        // Check if payment is valid
        if (validationData.status === 'VALID' || validationData.status === 'VALIDATED') {
            // Payment is successful and validated
            
            // TODO: Save to your database here
            // Example:
            // await savePaymentToDatabase({
            //     tran_id,
            //     amount,
            //     status: 'SUCCESS',
            //     card_type,
            //     bank_tran_id,
            //     tran_date,
            //     validation_data: validationData
            // });

            // Redirect to success page
            return NextResponse.redirect(
                new URL(`/payment/success?transactionId=${tran_id}&amount=${amount}`, request.url)
            );
        } else {
            // Validation failed
            console.error('Payment validation failed:', validationData);
            return NextResponse.redirect(
                new URL(`/payment/failed?transactionId=${tran_id}`, request.url)
            );
        }

    } catch (error) {
        console.error('Payment Success Handler Error:', error);
        return NextResponse.redirect(
            new URL('/payment/error', request.url)
        );
    }
}

// Also handle GET request (in case SSLCommerz sends GET)
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const tran_id = searchParams.get('transactionId');
    
    return NextResponse.redirect(
        new URL(`/payment/success?transactionId=${tran_id}`, request.url)
    );
}