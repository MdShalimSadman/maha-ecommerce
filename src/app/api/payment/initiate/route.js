import { NextResponse } from 'next/server';

// Environment variables for SSLCommerz
const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
// Assuming is_live is based on environment variable for better practice
const is_live = process.env.NODE_ENV === 'production'; 

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

    // Extract the order_id (Firestore ID)
    const { amount, customer_name, customer_email, order_id } = bodyData;
    
    if (!amount || !customer_name || !customer_email || !order_id) {
        return NextResponse.json(
            { message: 'Missing required fields (amount, name, email, or order_id)' },
            { status: 400 }
        );
    }

    // Generate a unique transaction ID for SSLCommerz
    const tran_id = 'TRN_' + Date.now();
    
    // Use the dynamic base URL from the request headers
    const base_url = request.headers.get('x-forwarded-proto') + '://' + request.headers.get('host');

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
        
        // Pass the Firestore order ID using the custom 'value_a' field
        value_a: order_id, 

        // Redirect URLs
        success_url: `${base_url}/api/payment/success`,
        fail_url: `${base_url}/api/payment/fail`,
        cancel_url: `${base_url}/checkout`,
        ipn_url: `${base_url}/api/payment/ipn`,
        
        // Customer Info (Using placeholder data where not provided by client)
        cus_name: customer_name,
        cus_email: customer_email,
        cus_add1: 'Dhaka', // Should be replaced with actual shipping address fields
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111', // Should be replaced with actual phone number

        // Product Info
        shipping_method: 'NO',
        product_name: 'E-commerce Order',
        product_category: 'Merchandise',
        product_profile: 'general',
    };

    try {
        const response = await fetch(sslczUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(paymentData).toString(),
        });

        const apiResponse = await response.json();
        
        console.log('SSLCommerz Initiation Response:', apiResponse);

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