import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const roleCookie = request.cookies.get('cue_user_role')?.value;
  const isLoggedIn = !!roleCookie;

  // Protect /owner routes -> owner only
  if (pathname.startsWith('/owner')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (roleCookie !== 'owner') {
      // Customer or staff trying to access owner area -> redirect to their default area
      const redirectPath = roleCookie === 'staff' ? '/staff' : '/';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // Protect /staff and /kitchen routes -> staff or owner only
  if (pathname.startsWith('/staff') || pathname.startsWith('/kitchen')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (roleCookie !== 'staff' && roleCookie !== 'owner') {
      // Customer trying to access staff area -> redirect to public home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect /profile route -> any logged-in user
  if (pathname.startsWith('/profile')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/owner/:path*', '/staff/:path*', '/kitchen/:path*', '/profile/:path*'],
};
