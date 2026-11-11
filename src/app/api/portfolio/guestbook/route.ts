import { NextRequest, NextResponse } from 'next/server';
import { fetchGuestbookMessages, insertGuestbookMessage } from '@/lib/neon/db';


export async function GET() {
  try {
    const messages = await fetchGuestbookMessages();
    return NextResponse.json({ success: true, messages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: 'Name and message are required' },
        { status: 400 }
      );
    }

    const newMessage = await insertGuestbookMessage(
      String(name).trim(),
      email ? String(email).trim() : null,
      String(message).trim()
    );

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
