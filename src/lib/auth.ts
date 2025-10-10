'use server';

import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserRole } from '@/modules/users/domain/entities/user-role.enum';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const key = new TextEncoder().encode(JWT_SECRET);
const cookieName = 'token';

type SessionPayload = {
    userId: string;
    email: string;
    role: UserRole;
    expires: Date;
}

export async function encrypt(payload: Omit<SessionPayload, 'expires'>) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    return new SignJWT({ ...payload, expires })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify<SessionPayload>(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return null;
    }
}

export async function createSession(userId: string, email: string, role: UserRole) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const token = await encrypt({ userId, email, role });

    (await cookies()).set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookie = (await cookies()).get(cookieName)?.value;
    if (!cookie) return null;
    return await decrypt(cookie);
}

export async function clearSession() {
    (await cookies()).delete(cookieName);
}

export async function verifySession(role?: UserRole | UserRole[]) {
    const session = await getSession();

    if (!session?.userId) {
        return { isAuthenticated: false, user: null, error: 'No active session' };
    }
    
    if (role) {
        const rolesToCheck = Array.isArray(role) ? role : [role];
        if (!rolesToCheck.includes(session.role)) {
            return { isAuthenticated: false, user: null, error: 'Insufficient permissions' };
        }
    }

    return { isAuthenticated: true, user: session };
}

export async function protectedRoute(role?: UserRole | UserRole[], redirectTo = '/admin/login') {
    const { isAuthenticated, error } = await verifySession(role);
    if (!isAuthenticated) {
        redirect(redirectTo);
    }
    return getSession();
}
