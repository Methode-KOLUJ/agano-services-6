import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();
        const callCenterPassword = process.env.CALL_CENTER_PASSWORD;

        if (!callCenterPassword) {
            console.error('CALL_CENTER_PASSWORD not set in environment variables');
            return NextResponse.json({ success: false, error: 'Configuration error' }, { status: 500 });
        }

        if (password === callCenterPassword) {
            // Set a secure HTTP-only cookie
            const response = NextResponse.json({ success: true });
            response.cookies.set('call_center_auth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 24 hours
            });
            return response;
        } else {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
