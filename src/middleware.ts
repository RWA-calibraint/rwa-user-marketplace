import { NextRequest, NextResponse } from 'next/server';

const unauthenticatedRoutes = ['/', '/terms', '/faq', '/policy'];

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('user-access-token') || request.cookies.has('token');
  const pathname = request.nextUrl.pathname;

  // Allow requests for SVG files directly.
  if (pathname.endsWith('.svg') || pathname.endsWith('.png') || pathname.endsWith('.gif')) {
    return NextResponse.next();
  }

  if (unauthenticatedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated && pathname !== '/') {
    return NextResponse.redirect(new URL('/?login-required=true', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)'],
};
