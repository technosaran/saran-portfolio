const { Pool } = require('pg');

async function syncRealData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL.replace(/([?&])sslmode=require\b/g, '$1sslmode=verify-full'),
    ssl: { rejectUnauthorized: true }
  });

  try {
    // 1. Update Profile with real LeetCode URL
    const profRes = await pool.query(`
      UPDATE profile
      SET leetcode_url = 'https://leetcode.com/u/Saran-R/',
          updated_at = NOW()
      WHERE id = 1
      RETURNING *;
    `);
    console.log('✅ Updated profile in DB:', profRes.rows[0]?.leetcode_url);

    // 2. Verify all projects
    const projRes = await pool.query('SELECT id, title, github_url, live_url FROM projects');
    console.log('Current DB projects:', projRes.rows);

  } catch (err) {
    console.error('Error syncing real data:', err);
  } finally {
    await pool.end();
  }
}

syncRealData();
