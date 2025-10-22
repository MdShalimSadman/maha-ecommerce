'use client'; 

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient'; // Your client-side auth instance (check your path)
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }
    
    try {
      // Send the password reset email using Firebase Auth
      await sendPasswordResetEmail(auth, email);

      // Important: We show a generic success message even if the email wasn't found 
      // This prevents attackers from knowing which emails are registered.
      setSuccess("If that email is registered, a password reset link has been sent to your inbox. Please check your spam folder also.");
      setEmail(''); // Clear the input

    } catch (err) {
      console.error('Forgot Password Error:', err);
      // For security, you might want to show the generic success message here too.
      // However, if you need debugging info:
      setError('Failed to process your request. Please try again.'); 

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Reset Your Password
        </h2>
        <p className="text-center text-gray-600 text-sm">
            Enter the email address you use to sign in.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-lg text-white font-semibold shadow-md transition duration-300 
              ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
          >
            {loading ? 'Sending Request...' : 'Send Reset Link'}
          </button>
        </form>
        
        {/* Back to Login Link */}
        <div className="text-sm text-center">
          <a href="/login" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}