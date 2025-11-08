// app/api/payment/fail/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log('Payment Failed Data:', data);

        const { tran_id, error } = data;

        // TODO: Update database status to FAILED
        // await updatePaymentStatus(tran_id, 'FAILED', data);

        return NextResponse.redirect(
            new URL(`/payment/failed?transactionId=${tran_id}&error=${error || 'Payment failed'}`, request.url)
        );

    } catch (error) {
        console.error('Payment Fail Handler Error:', error);
        return NextResponse.redirect(
            new URL('/payment/error', request.url)
        );
    }
}

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const tran_id = searchParams.get('transactionId');
    
    return NextResponse.redirect(
        new URL(`/payment/failed?transactionId=${tran_id}`, request.url)
    );
}