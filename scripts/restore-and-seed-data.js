const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function seedData() {
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

  const connectionString = match[1].replace(/([?&])sslmode=require\b/g, '$1sslmode=verify-full');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: true },
  });

  const backupFilePath = path.resolve(process.cwd(), 'scripts', 'backup-before-clear.json');
  if (!fs.existsSync(backupFilePath)) {
    console.error('backup-before-clear.json not found');
    process.exit(1);
  }

  const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));

  try {
    console.log('Connecting to database...');

    // 1. Sync Profile
    console.log('--- Syncing Profile ---');
    const profileItem = backupData.tables.profile?.[0];
    if (profileItem) {
      const existingProfile = await pool.query('SELECT id FROM public.profile LIMIT 1');
      if (existingProfile.rows.length === 0) {
        await pool.query(`
          INSERT INTO public.profile (
            full_name, title, headline, bio, email, phone, location, college, degree, graduation_year, github_url, linkedin_url, website_url, leetcode_url, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
        `, [
          profileItem.full_name,
          profileItem.title,
          profileItem.headline,
          profileItem.bio,
          profileItem.email,
          profileItem.phone,
          profileItem.location,
          profileItem.college,
          profileItem.degree,
          profileItem.graduation_year,
          profileItem.github_url,
          profileItem.linkedin_url,
          profileItem.website_url,
          profileItem.leetcode_url || 'https://leetcode.com/u/Saran-R/'
        ]);
        console.log('Inserted profile record.');
      } else {
        await pool.query(`
          UPDATE public.profile SET
            full_name = $1, title = $2, headline = $3, bio = $4, email = $5, phone = $6, location = $7, college = $8, degree = $9, graduation_year = $10, github_url = $11, linkedin_url = $12, website_url = $13, leetcode_url = $14, updated_at = NOW()
          WHERE id = $15
        `, [
          profileItem.full_name,
          profileItem.title,
          profileItem.headline,
          profileItem.bio,
          profileItem.email,
          profileItem.phone,
          profileItem.location,
          profileItem.college,
          profileItem.degree,
          profileItem.graduation_year,
          profileItem.github_url,
          profileItem.linkedin_url,
          profileItem.website_url,
          profileItem.leetcode_url || 'https://leetcode.com/u/Saran-R/',
          existingProfile.rows[0].id
        ]);
        console.log('Updated existing profile record.');
      }
    }

    // 2. Sync Projects with WHERE NOT EXISTS duplicate prevention
    console.log('\n--- Syncing Projects ---');
    const projects = backupData.tables.projects || [];
    for (const p of projects) {
      const res = await pool.query(`
        INSERT INTO public.projects (title, description, tech_stack, github_url, live_url, highlights)
        SELECT $1, $2, $3, $4, $5, $6
        WHERE NOT EXISTS (
          SELECT 1 FROM public.projects 
          WHERE ($4::text IS NOT NULL AND $4::text <> '' AND github_url = $4)
             OR LOWER(title) = LOWER($1)
        )
        RETURNING id, title;
      `, [p.title, p.description, p.tech_stack, p.github_url || null, p.live_url || null, p.highlights || []]);

      if (res.rows.length > 0) {
        console.log(`Inserted project: ${p.title} (ID: ${res.rows[0].id})`);
      } else {
        console.log(`Project already exists: ${p.title}`);
      }
    }

    // 3. Sync Experience with WHERE NOT EXISTS duplicate prevention
    console.log('\n--- Syncing Experience ---');
    const experience = backupData.tables.experience || [];
    for (const exp of experience) {
      const res = await pool.query(`
        INSERT INTO public.experience (intern_id, role, company, period, location, description)
        SELECT $1, $2, $3, $4, $5, $6
        WHERE NOT EXISTS (
          SELECT 1 FROM public.experience 
          WHERE intern_id = $1 
             OR (LOWER(role) = LOWER($2) AND LOWER(company) = LOWER($3))
        )
        RETURNING id, role, company;
      `, [exp.intern_id, exp.role, exp.company, exp.period, exp.location || 'Remote', exp.description || []]);

      if (res.rows.length > 0) {
        console.log(`Inserted experience: ${exp.role} at ${exp.company} (ID: ${res.rows[0].id})`);
      } else {
        console.log(`Experience already exists: ${exp.role} at ${exp.company}`);
      }
    }

    // 4. Sync Certificates with WHERE NOT EXISTS duplicate prevention
    console.log('\n--- Syncing Certificates ---');
    const certificates = backupData.tables.certificates || [];
    for (const c of certificates) {
      const res = await pool.query(`
        INSERT INTO public.certificates (credential_id, title, provider, issue_date, url)
        SELECT $1, $2, $3, $4, $5
        WHERE NOT EXISTS (
          SELECT 1 FROM public.certificates 
          WHERE ($1::text IS NOT NULL AND $1::text <> '' AND credential_id = $1)
             OR (LOWER(title) = LOWER($2) AND LOWER(provider) = LOWER($3))
        )
        RETURNING id, title, provider;
      `, [c.credential_id || null, c.title, c.provider, c.issue_date || '2025', c.url || null]);

      if (res.rows.length > 0) {
        console.log(`Inserted certificate: ${c.title} by ${c.provider} (ID: ${res.rows[0].id})`);
      } else {
        console.log(`Certificate already exists: ${c.title}`);
      }
    }

    // 5. Clean & Sync Skills
    console.log('\n--- Syncing Skills ---');
    // Normalize existing skills that were incorrectly classified under "Programming Languages"
    const skillCategoryFixes = [
      { name: 'Vercel', category: 'Cloud & DevOps', level: 'Expert' },
      { name: 'Render', category: 'Cloud & DevOps', level: 'Advanced' },
      { name: 'Aws', category: 'Cloud & DevOps', level: 'Advanced' },
      { name: 'Supabase', category: 'Databases & Developer Tools', level: 'Advanced' },
      { name: 'Next js', category: 'Web & Backend Frameworks', level: 'Expert' },
      { name: 'React', category: 'Web & Backend Frameworks', level: 'Expert' },
      { name: 'Sql', category: 'Programming Languages', level: 'Proficient' },
      { name: 'Typescript', category: 'Programming Languages', level: 'Advanced' },
      { name: 'Java', category: 'Programming Languages', level: 'Expert' },
    ];

    for (const fix of skillCategoryFixes) {
      await pool.query(`
        UPDATE public.skills
        SET category = $1, level = $2
        WHERE LOWER(name) = LOWER($3)
      `, [fix.category, fix.level, fix.name]);
    }

    const backupSkills = backupData.tables.skills || [];
    for (const s of backupSkills) {
      const res = await pool.query(`
        INSERT INTO public.skills (name, category, level)
        SELECT $1, $2, $3
        WHERE NOT EXISTS (
          SELECT 1 FROM public.skills 
          WHERE LOWER(name) = LOWER($1)
        )
        RETURNING id, name, category;
      `, [s.name, s.category, s.level || 'Proficient']);

      if (res.rows.length > 0) {
        console.log(`Inserted skill: ${s.name} (${s.category})`);
      }
    }

    // 6. Summary of current row counts
    console.log('\n=========================================');
    console.log('Final Database Row Counts:');
    const tables = ['profile', 'projects', 'skills', 'experience', 'certificates', 'admin_users'];
    for (const t of tables) {
      const countRes = await pool.query(`SELECT count(*) FROM public."${t}"`);
      console.log(`- ${t}: ${countRes.rows[0].count} rows`);
    }
    console.log('=========================================');

  } catch (err) {
    console.error('Error during data seeding:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedData();
