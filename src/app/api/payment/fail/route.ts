import { type NextRequest } from 'next/server';
import axios from 'axios'; 

function getBaseUrl(request: NextRequest): string {
    const url = new URL(request.url);
    return url.origin;
}

export async function POST(request: NextRequest) {
    const baseUrl = getBaseUrl(request);
    
    try {
        const formData = await request.formData();
        
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value as string;
        });

        const { tran_id, error } = data;

        const redirectUrl = `${baseUrl}/payment-failed?transactionId=${tran_id || 'unknown'}&error=${error || 'Payment failed'}`;

        return new Response(null, {
            status: 303,
            headers: { 'Location': redirectUrl }
        });

    } catch (error) {
        const errorUrl = `${baseUrl}/payment/error`;
        
        return new Response(null, {
            status: 303,
            headers: { 'Location': errorUrl }
        });
    }
}

export async function GET(request: NextRequest) {
    const baseUrl = getBaseUrl(request);
    const searchParams = request.nextUrl.searchParams;
    const tran_id = searchParams.get('transactionId');
    
    const redirectUrl = `${baseUrl}/payment-failed?transactionId=${tran_id || 'unknown'}`;

    return new Response(null, {
        status: 303,
        headers: { 'Location': redirectUrl }
    });
}