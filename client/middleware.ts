import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/'];

/** Routes and which roles are allowed */
const ROUTE_ROLE_MAP: Record<string, string[]> = {
    '/activity': ['Manager'],
    '/reports': ['Manager'],
    '/staffs': ['Manager'],
    '/inventory': ['Manager'],
    '/settings': ['Manager'],
    '/signup': ['Manager'],
    '/kds': ['Chef'],
    '/register': ['Cashier', 'Waiter', 'Manager'],
    '/orders': ['Cashier', 'Waiter', 'Manager'],
};

/** Default landing page for each role */
const ROLE_DEFAULTS: Record<string, string> = {
    Manager: '/activity',
    Cashier: '/register',
    Waiter: '/register',
    Chef: '/kds',
};

/**
 * Decode a JWT payload on the Edge runtime using atob (no Node.js libraries).
 * Returns the parsed payload object, or null on failure.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Base64url → Base64 → decode
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base64);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip public routes, static assets, and API calls
    if (
        PUBLIC_PATHS.some(p => pathname === p) ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Read the auth cookie
    const token = request.cookies.get('pos_auth_token')?.value;
    console.log(token);

    if (!token) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }

    // Decode JWT and extract role
    const payload = decodeJwtPayload(token);
    // Support both simple "role" claim and full .NET claim URI
    const role: string | undefined =
        payload?.role ||
        payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!role) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }

    // Check route-level authorization
    const matchedRoute = Object.keys(ROUTE_ROLE_MAP).find(route => pathname.startsWith(route));

    if (matchedRoute) {
        const allowedRoles = ROUTE_ROLE_MAP[matchedRoute];
        if (!allowedRoles.includes(role)) {
            // Redirect unauthorized user to their own default workspace
            const fallback = ROLE_DEFAULTS[role] || '/login';
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = fallback;
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - _next/static, _next/image (static files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
