// ─── Next.js Middleware ─────────────────────────────────────────────────────
// Protects all /admin/* and /api/admin/* routes.
//  • Pages: unauthenticated users are redirected to /admin/login.
//  • APIs:  unauthenticated requests get a JSON 401 (NOT an HTML redirect), so
//           admin fetch() calls can show "session expired" instead of failing to
//           parse a login page.
// The session cookie name is set explicitly to match src/lib/auth.ts so that
// verification does not depend on NEXTAUTH_URL being https on the host.

import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const SESSION_COOKIE =
  process.env.NODE_ENV === 'production'
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public: the login page
  if (pathname.startsWith('/admin/login')) return NextResponse.next()

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: SESSION_COOKIE,
  })
  if (token) return NextResponse.next()

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      {
        ok: false,
        code: 'UNAUTHENTICATED',
        // error stays a plain string so every admin client (which reads data.error) can show it.
        error: 'Your session has expired. Please sign in again.',
      },
      { status: 401 },
    )
  }

  const loginUrl = new URL('/admin/login', req.url)
  loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
