// app/api/payment/callback/route.ts
import { type NextRequest } from 'next/server';
import axios from 'axios';
import nodemailer from 'nodemailer';

import { fetchOrderDetails, updatePaymentStatus } from '@/firebase/admin';

const store_id = process.env.SSL_COMMERZ_STORE_ID;
const store_passwd = process.env.SSL_COMMERZ_STORE_PASSWORD;
const is_live = process.env.NODE_ENV === 'production';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password or SMTP password
  },
});

// Email sender helper
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"MAHAA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// ---------------------
// Helpers
// ---------------------
function getBaseUrl(request: NextRequest): string {
  const url = new URL(request.url);
  return url.origin;
}

// ---------------------
// POST handler
// ---------------------
export async function POST(request: NextRequest) {
  const baseUrl = getBaseUrl(request);

  if (!store_id || !store_passwd) {
    console.error('SSLCommerz credentials missing.');
    const errorUrl = `${baseUrl}/payment-failed?reason=config_error`;
    return new Response(null, { status: 303, headers: { 'Location': errorUrl } });
  }

  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => (data[key] = value as string));

    const { val_id, tran_id, amount, value_a: firestoreOrderId } = data;

    if (!val_id || !tran_id || !amount || !firestoreOrderId) {
      console.error('Missing essential data in callback.', data);
      const errorUrl = `${baseUrl}/payment-failed?reason=missing_data`;
      return new Response(null, { status: 303, headers: { 'Location': errorUrl } });
    }

    const validationUrl = is_live
      ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
      : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';

    const validationParams = new URLSearchParams({
      val_id,
      store_id,
      store_passwd,
      format: 'json',
    });

    const validationResponse = await axios.get(`${validationUrl}?${validationParams.toString()}`);
    const validationData = validationResponse.data;
    const status = validationData.status;

    if (status === 'VALID' || status === 'VALIDATED') {
      let orderDetails;

      try {
        orderDetails = await fetchOrderDetails(firestoreOrderId);
      } catch (fetchError) {
        console.error('Failed to fetch order details for email:', fetchError);
      }

      try {
        await updatePaymentStatus(firestoreOrderId, tran_id, validationData);
      } catch (dbError) {
        console.error('Database Update FAILED, proceeding with redirect:', dbError);
      }

      // ---------------------
      // Send emails via NodeMailer
      // ---------------------
      if (orderDetails) {
        const { email, fullName, totalPrice, address, phone, paymentMethod } = orderDetails;
        const formattedTotalPrice = Number(totalPrice);

        try {
          // Customer Email
          await sendEmail(
            email,
            'Order Confirmation',
            `<p>Hi ${fullName},</p>
             <p>Thank you for your order #${firestoreOrderId}.</p>
             <p>Total: $${formattedTotalPrice}</p>`
          );
          console.log('Customer email sent successfully.');

          // Admin Email
          await sendEmail(
            process.env.ADMIN_EMAIL||"",
            'New Order Received',
            `<p>New order #${firestoreOrderId} received.</p>
             <p>Name: ${fullName}</p>
             <p>Email: ${email}</p>
             <p>Phone: ${phone}</p>
             <p>Address: ${address}</p>
             <p>Amount: $${formattedTotalPrice}</p>
             <p>Payment Method: ${paymentMethod.replace(/_/g, ' ')}</p>`
          );
          console.log('Admin email sent successfully.');
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }
      } else {
        console.warn('Emails skipped: order details missing.');
      }

      // Redirect to success
      const successUrl = `${baseUrl}/payment-success?transactionId=${tran_id}&orderId=${firestoreOrderId}`;
      return new Response(null, { status: 303, headers: { 'Location': successUrl } });
    } else {
      console.error('Payment validation failed:', validationData);
      const failedUrl = `${baseUrl}/payment-failed?transactionId=${tran_id}&status=${status}&orderId=${firestoreOrderId}`;
      return new Response(null, { status: 303, headers: { 'Location': failedUrl } });
    }
  } catch (error) {
    console.error('Payment POST handler error:', error);
    const errorUrl = `${baseUrl}/payment/error`;
    return new Response(null, { status: 303, headers: { 'Location': errorUrl } });
  }
}

// ---------------------
// GET handler (unchanged)
// ---------------------
export async function GET(request: NextRequest) {
  const tran_id = request.nextUrl.searchParams.get('tran_id') || request.nextUrl.searchParams.get('transactionId');
  const order_id = request.nextUrl.searchParams.get('orderId');
  const status = request.nextUrl.searchParams.get('status');

  const baseUrl = getBaseUrl(request);

  let redirectUrl: string;

  if (tran_id && order_id && (status === 'Success' || status === 'DONE' || !status)) {
    redirectUrl = `${baseUrl}/payment-success?transactionId=${tran_id}&orderId=${order_id}`;
  } else if (status === 'FAILED' || status === 'CANCELLED') {
    redirectUrl = `${baseUrl}/payment-failed?transactionId=${tran_id}&status=${status}&orderId=${order_id || ''}`;
  } else {
    redirectUrl = `${baseUrl}/payment/error`;
  }

  return new Response(null, { status: 303, headers: { 'Location': redirectUrl } });
}
