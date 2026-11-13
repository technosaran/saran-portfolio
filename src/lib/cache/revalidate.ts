import { revalidatePath, revalidateTag } from 'next/cache';

export const PORTFOLIO_CACHE_TAG = 'portfolio-data';

export function invalidatePortfolioCache(): void {
  try {
    // Invalidate static page and cached API
    revalidateTag(PORTFOLIO_CACHE_TAG, 'max-stale=0');
    revalidatePath('/', 'page');
    revalidatePath('/api/portfolio/data', 'page');
  } catch (err) {
    // In edge runtime or build-time contexts, revalidate might log a warning
    console.warn('[CACHE REVALIDATE] Note:', err instanceof Error ? err.message : String(err));
  }
}
