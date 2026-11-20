import { portfolioEvents, initDatabaseWatcher } from '@/lib/realtime/events';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  initDatabaseWatcher();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Initial connect event
      const initialPayload = `data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`;
      controller.enqueue(encoder.encode(initialPayload));

      // 2. Real-time change listener
      const onChange = (payload: unknown) => {
        try {
          const msg = `data: ${JSON.stringify({ type: 'update', payload, timestamp: Date.now() })}\n\n`;
          controller.enqueue(encoder.encode(msg));
        } catch {
          // Stream might be closed
        }
      };

      portfolioEvents.on('portfolio_update', onChange);

      // 3. Heartbeat to keep SSE alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch {
          clearInterval(interval);
        }
      }, 15000);

      // Clean up when request is aborted
      req.signal.addEventListener('abort', () => {
        portfolioEvents.off('portfolio_update', onChange);
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
