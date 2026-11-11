import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/neon/db';


export async function GET(req: NextRequest) {
  const token = req.cookies.get('portfolio_admin_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const email = verifyToken(token);
  if (!email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, email });
}
