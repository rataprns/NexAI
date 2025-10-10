import { NextRequest, NextResponse } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  urlMappingStrategy: 'rewrite',
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie
  const tokenCookie = request.cookies.get('token');

  // If trying to access dashboard without a token, redirect to login
  if (pathname.includes('/dashboard') && !tokenCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    // The I18nMiddleware will handle the locale prefix rewrite after this redirection.
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login page with a token, redirect to dashboard
  if (pathname.includes('/admin/login') && tokenCookie) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // The negative lookahead `(?!api|...)` is not supported in all regex engines,
    // but it is in Next.js middleware.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
