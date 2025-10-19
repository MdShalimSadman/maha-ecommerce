// app/api/logout/route.js

import { NextResponse } from 'next/server';

// Match the cookie name used in your /api/login route
const COOKIE_NAME = 'session-token'; 
const MAX_AGE = 0; // Setting max-age to 0 or a past date expires the cookie

export async function POST() {
  const response = new NextResponse(JSON.stringify({ status: 'success', message: 'Logged out' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Set the cookie header to expire the cookie immediately
      'Set-Cookie': `${COOKIE_NAME}=deleted; Max-Age=${MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    },
  });

  return response;
}