import { NextResponse, NextRequest } from 'next/server';
import { adminAuth } from '@/firebase/admin'; 

const MAX_AGE = 60 * 60 * 24 * 5; 
const COOKIE_NAME = 'session-token';


export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: MAX_AGE * 1000 });

    const response = new NextResponse(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${COOKIE_NAME}=${sessionCookie}; Max-Age=${MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      },
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse(JSON.stringify({ error: 'Authentication failed' }), { status: 401 });
  }
}