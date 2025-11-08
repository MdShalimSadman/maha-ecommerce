// app/payment/failed/page.js
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentFailedPage() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('transactionId');
    const error = searchParams.get('error');

    return (
        <div style={{ 
            padding: '40px', 
            maxWidth: '600px', 
            margin: '50px auto', 
            textAlign: 'center',
            border: '2px solid #f44336',
            borderRadius: '10px',
            backgroundColor: '#fff9f9'
        }}>
            <h1 style={{ color: '#f44336' }}>❌ Payment Failed</h1>
            <p>Unfortunately, your payment could not be processed.</p>
            
            {transactionId && (
                <div style={{ 
                    margin: '20px 0', 
                    padding: '15px', 
                    backgroundColor: '#fff',
                    borderRadius: '5px'
                }}>
                    <p><strong>Transaction ID:</strong> {transactionId}</p>
                    {error && <p><strong>Error:</strong> {error}</p>}
                </div>
            )}

            <Link href="/checkout" style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
            }}>
                Try Again
            </Link>
        </div>
    );
}