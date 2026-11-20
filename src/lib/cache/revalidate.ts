import { revalidatePath, revalidateTag } from 'next/cache';
import { notifyDataChanged } from '@/lib/realtime/events';

export const PORTFOLIO_CACHE_TAG = 'portfolio-data';

export function invalidatePortfolioCache(): void {
  try {
    // 1. Invalidate static page and cached API
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max-stale=0');
    revalidatePath('/', 'page');
    revalidatePath('/api/portfolio/data', 'page');
  } catch (err) {
    // In edge runtime or build-time contexts, revalidate might log a warning
    console.warn('[CACHE REVALIDATE] Note:', err instanceof Error ? err.message : String(err));
  }

  // 2. Broadcast real-time change event to all active live streams
  try {
    notifyDataChanged();
  } catch (err) {
    console.warn('[REALTIME BROADCAST ERROR]', err);
  }
}
