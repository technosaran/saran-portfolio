import { EventEmitter } from 'events';
import { getDbPool } from '@/lib/db';

declare global {
  var __portfolio_event_emitter: EventEmitter | undefined;
  var __portfolio_db_poller_active: boolean | undefined;
  var __portfolio_last_checksum: string | undefined;
}

if (!global.__portfolio_event_emitter) {
  global.__portfolio_event_emitter = new EventEmitter();
  global.__portfolio_event_emitter.setMaxListeners(100);
}

export const portfolioEvents = global.__portfolio_event_emitter;

export function notifyDataChanged(detail?: { table?: string; action?: string }): void {
  const payload = {
    timestamp: Date.now(),
    detail: detail || { table: 'all', action: 'update' },
  };
  portfolioEvents.emit('portfolio_update', payload);
}

// Background database change poller to detect changes even if executed via direct SQL
export function initDatabaseWatcher(): void {
  if (global.__portfolio_db_poller_active) return;
  global.__portfolio_db_poller_active = true;

  const checkDb = async () => {
    try {
      const pool = getDbPool();
      const res = await pool.query(`
        SELECT 
          (SELECT count(*) FROM projects) as p_count,
          (SELECT count(*) FROM skills) as s_count,
          (SELECT count(*) FROM experience) as e_count,
          (SELECT count(*) FROM certificates) as c_count,
          (SELECT COALESCE(MAX(updated_at), '1970-01-01'::timestamptz) FROM profile) as prof_upd
      `);
      
      const row = res.rows[0];
      const checksum = `${row.p_count}-${row.s_count}-${row.e_count}-${row.c_count}-${row.prof_upd}`;

      if (global.__portfolio_last_checksum && global.__portfolio_last_checksum !== checksum) {
        notifyDataChanged({ table: 'database', action: 'direct_sql_change' });
      }
      global.__portfolio_last_checksum = checksum;
    } catch {
      // Ignore background poll errors (e.g. during build or idle pool)
    }
  };

  setInterval(checkDb, 2500);
}
