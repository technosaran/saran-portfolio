const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function clearDatabase() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local file not found');
    process.exit(1);
  }

  const env = fs.readFileSync(envPath, 'utf8');
  const match = env.match(/DATABASE_URL="?([^"\r\n]+)/);
  if (!match) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
  }

  const connectionString = match[1];
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to database...');

    // 1. Create a safety backup
    const tablesToBackup = ['profile', 'projects', 'skills', 'experience', 'certificates', 'guestbook_messages'];
    const backupData = {
      backupTimestamp: new Date().toISOString(),
      tables: {}
    };

    for (const table of tablesToBackup) {
      const res = await pool.query(`SELECT * FROM "${table}"`);
      backupData.tables[table] = res.rows;
      console.log(`Backed up ${table}: ${res.rows.length} rows`);
    }

    const backupFilePath = path.resolve(process.cwd(), 'scripts', 'backup-before-clear.json');
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');
    console.log(`\n Safety backup created at: ${backupFilePath}`);

    // 2. Clear content tables and restart ID sequences
    console.log('\nTruncating content tables and restarting ID sequences...');
    const truncateSql = `
      TRUNCATE TABLE 
        projects,
        skills,
        experience,
        certificates,
        guestbook_messages,
        profile
      RESTART IDENTITY CASCADE;
    `;
    await pool.query(truncateSql);
    console.log('Truncate completed successfully.');

    // 3. Verify counts
    console.log('\nVerifying current row counts in all tables:');
    const allTables = [
      'profile',
      'projects',
      'skills',
      'experience',
      'certificates',
      'guestbook_messages',
      'admin_users',
      'admin_sessions'
    ];

    for (const table of allTables) {
      const countRes = await pool.query(`SELECT count(*) FROM "${table}"`);
      console.log(`- ${table}: ${countRes.rows[0].count} rows`);
    }

  } catch (err) {
    console.error('Database clearing error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

clearDatabase();
