// app/api/payment/initiate/route.js
import { NextResponse } from 'next/server';

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
const is_live = false;

export async function POST(request) {
    if (!store_id || !store_passwd) {
        console.error('Missing SSLCommerz credentials');
        return NextResponse.json(
            { message: 'Server configuration error' }, 
            { status: 500 }
        );
    }
    
    let bodyData;
    try {
        bodyData = await request.json(); 
    } catch (e) {
        return NextResponse.json(
            { message: 'Invalid request body' }, 
            { status: 400 }
        );
    }

    const { amount, customer_name, customer_email } = bodyData;
    
    if (!amount || !customer_name || !customer_email) {
        return NextResponse.json(
            { message: 'Missing required fields' },
            { status: 400 }
        );
    }

    const tran_id = 'TRN_' + Date.now();
    const base_url = process.env.BASE_URL || 'http://localhost:3000';

    // SSLCommerz API endpoint
    const sslczUrl = is_live 
        ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
        : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

    const paymentData = {
        store_id: store_id,
        store_passwd: store_passwd,
        total_amount: parseFloat(amount),
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${base_url}/api/payment/success`,
        fail_url: `${base_url}/api/payment/fail`,
        cancel_url: `${base_url}/checkout`,
        ipn_url: `${base_url}/api/payment/ipn`,
        
        cus_name: customer_name,
        cus_email: customer_email,
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        
        shipping_method: 'NO',
        product_name: 'Test Product',
        product_category: 'Electronic',
        product_profile: 'general',
    };

    try {
        // Direct fetch call to SSLCommerz API
        const response = await fetch(sslczUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(paymentData).toString(),
        });

        const apiResponse = await response.json();
        
        console.log('SSLCommerz Response:', apiResponse);

        if (apiResponse.status === 'SUCCESS' && apiResponse.GatewayPageURL) {
            return NextResponse.json({ 
                GatewayPageURL: apiResponse.GatewayPageURL,
                status: 'success' 
            });
        } else {
            return NextResponse.json({ 
                message: 'Payment initiation failed',
                details: apiResponse
            }, { status: 400 });
        }

    } catch (error) {
        console.error('SSLCommerz Error:', error);
        return NextResponse.json({ 
            message: 'Failed to initiate payment',
            error: error.message
        }, { status: 500 });
    }
}