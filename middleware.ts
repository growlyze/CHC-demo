import { NextResponse, type NextRequest } from 'next/server';

// Optional password gate: set DASHBOARD_PASSWORD in Vercel to turn it on.
export function middleware(req: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return NextResponse.next();
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      if (decoded.slice(decoded.indexOf(':') + 1) === password) return NextResponse.next();
    } catch { /* fall through */ }
  }
  return new NextResponse('Password required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="CHC Payroll", charset="UTF-8"' },
  });
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
