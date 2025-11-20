'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('transactionId');
    const amount = searchParams.get('amount');

    return (
        <div style={{ 
            padding: '40px', 
            maxWidth: '600px', 
            margin: '50px auto', 
            textAlign: 'center',
            border: '2px solid #4CAF50',
            borderRadius: '10px',
            backgroundColor: '#f9fff9'
        }}>
            <h1 style={{ color: '#4CAF50' }}>✅ Payment Successful!</h1>
            <p>Your payment has been processed successfully.</p>
            
            {transactionId && (
                <div style={{ 
                    margin: '20px 0', 
                    padding: '15px', 
                    backgroundColor: '#fff',
                    borderRadius: '5px'
                }}>
                    <p><strong>Transaction ID:</strong> {transactionId}</p>
                    {amount && <p><strong>Amount:</strong> {amount} BDT</p>}
                </div>
            )}

            <Link href="/" style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
            }}>
                Back to Home
            </Link>
        </div>
    );
}