import { authController } from '@/modules/users/interfaces/controllers/auth.controller';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { action: string[] } }) {
    const action = params.action[0];
    
    switch (action) {
        case 'login':
            return authController.loginHandler(req);
        case 'register':
            return authController.registerHandler(req);
        case 'logout':
            return authController.logoutHandler(req);
        default:
            return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
}
