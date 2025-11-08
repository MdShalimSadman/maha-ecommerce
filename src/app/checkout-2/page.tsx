// app/checkout/page.js
'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [amount, setAmount] = useState(100.50);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const paymentDetails = {
      amount: amount,
      customer_name: 'Next JS User',
      customer_email: 'user@nextjs.com',
    };

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDetails),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        alert('Payment initiation failed: ' + (errorData.message || response.statusText));
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.GatewayPageURL) {
        // Show payment URL in iframe instead of redirecting
        setPaymentUrl(data.GatewayPageURL);
      } else {
        alert('Payment initiation failed: ' + (data.message || 'Unknown error.'));
        setLoading(false);
      }
    } catch (error) {
      console.error('Client-side Payment Error:', error);
      alert('An unexpected error occurred during checkout.');
      setLoading(false);
    }
  };

  if (paymentUrl) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <div style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0070f3', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>Complete Your Payment</h3>
          <button 
            onClick={() => setPaymentUrl(null)}
            style={{
              padding: '5px 15px',
              backgroundColor: 'white',
              color: '#0070f3',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
        <iframe 
          src={paymentUrl}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none' 
          }}
          title="Payment Gateway"
        />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '50px auto', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🛒 Checkout</h1>
      
      <div style={{ 
        margin: '30px 0', 
        padding: '20px', 
        backgroundColor: 'white',
        borderRadius: '5px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          <span>Total Amount:</span>
          <span style={{ color: '#0070f3' }}>{amount} BDT</span>
        </div>
      </div>
      
      <button 
        onClick={handlePayment} 
        disabled={loading} 
        style={{ 
          width: '100%',
          padding: '15px 20px', 
          backgroundColor: loading ? '#ccc' : '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}