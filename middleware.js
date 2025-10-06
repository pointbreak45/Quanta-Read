import { NextResponse } from 'next/server';

// GUEST MODE: Authentication middleware disabled
export async function middleware(req) {
  console.log('Guest Mode: Bypassing authentication for:', req.url);
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};
