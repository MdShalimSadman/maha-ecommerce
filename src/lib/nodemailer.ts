// lib/nodemailer.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",      // or your SMTP host
  port: 465,                   // 465 for secure, 587 for insecure
  secure: true,                // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,      // your email
    pass: process.env.EMAIL_PASS,      // your app password
  },
});
