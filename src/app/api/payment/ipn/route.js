// app/api/payment/ipn/route.js
import { NextResponse } from 'next/server';

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
const is_live = false;

export async function POST(request) {
    try {
        const formData = await request.formData();
        
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log('IPN Received:', data);

        const { val_id, tran_id, status } = data;

        // Validate with SSLCommerz
        const validationUrl = is_live
            ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
            : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`;

        const validationResponse = await fetch(validationUrl);
        const validationData = await validationResponse.json();

        if (validationData.status === 'VALID' || validationData.status === 'VALIDATED') {
            console.log('IPN Validated Successfully:', tran_id);
            
            // TODO: Update your database
            // await updatePaymentStatus(tran_id, 'SUCCESS', validationData);
            
            return NextResponse.json({ 
                message: 'IPN processed successfully' 
            }, { status: 200 });
        } else {
            console.error('IPN Validation Failed:', validationData);
            return NextResponse.json({ 
                message: 'IPN validation failed' 
            }, { status: 400 });
        }

    } catch (error) {
        console.error('IPN Handler Error:', error);
        return NextResponse.json({ 
            message: 'IPN processing error',
            error: error.message 
        }, { status: 500 });
    }
}