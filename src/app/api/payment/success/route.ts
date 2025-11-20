import { type NextRequest } from 'next/server';
import axios from 'axios'; 


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
        return new Response(null, {
            status: 303, 
            headers: { 'Location': errorUrl }
        });
    }
    
    try {
        const formData = await request.formData();

        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value as string;
        });

        const { val_id, tran_id, amount } = data;

        if (!val_id || !tran_id || !amount) {
            console.error('Missing essential data in callback.', data);
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
            const successUrl = `${baseUrl}/payment-success?transactionId=${tran_id}&amount=${amount}`;
            
          
            return new Response(null, {
                status: 303, 
                headers: {
                    'Location': successUrl,
                },
            });
        } else {
            console.error('Payment validation failed:', validationData);
            const failedUrl = `${baseUrl}/payment-failed?transactionId=${tran_id}&status=${status}`;

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
    const tran_id = request.nextUrl.searchParams.get('tran_id') || request.nextUrl.searchParams.get('transactionId');
    const status = request.nextUrl.searchParams.get('status');

    const baseUrl = getBaseUrl(request); // Use the robust getBaseUrl fix

    let redirectUrl: string;

    if (tran_id && (status === 'Success' || status === 'DONE')) {
        redirectUrl = `${baseUrl}/payment-success?transactionId=${tran_id}`;
    } else if (status === 'FAILED' || status === 'CANCELLED') {
        redirectUrl = `${baseUrl}/payment-failed?transactionId=${tran_id}&status=${status}`;
    } else {
        redirectUrl = `${baseUrl}/payment/error`;
    }

    return new Response(null, {
        status: 303, 
        headers: { 'Location': redirectUrl }
    });
}