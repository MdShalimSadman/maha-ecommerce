// middleware.ts (or middleware.js in the root directory)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'session-token';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/dashboard')) {
    
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      
      // Optionally add a search parameter to redirect the user back after login
      loginUrl.searchParams.set('redirect', pathname); 
      
      return NextResponse.redirect(loginUrl);
    }
    
    // If a session cookie exists, allow access
    return NextResponse.next();
  }

  // Allow access to all other paths (home, login, etc.)
  return NextResponse.next();
}

// Specify the paths the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};