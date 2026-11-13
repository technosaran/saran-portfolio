const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        if (line.startsWith('DATABASE_URL=')) {
          return line.substring('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch {
    // Ignore error
  }
  return '';
}

async function loadData() {
  const dbUrl = getDatabaseUrl();
  if (dbUrl) {
    try {
      const pool = new Pool({
        connectionString: dbUrl.replace(/([?&])sslmode=require\b/g, '$1sslmode=verify-full'),
        ssl: { rejectUnauthorized: true },
        connectionTimeoutMillis: 5000,
      });

      const [profileRes, projRes, expRes, skillsRes, certsRes] = await Promise.all([
        pool.query('SELECT * FROM public.profile ORDER BY id ASC LIMIT 1'),
        pool.query('SELECT * FROM public.projects ORDER BY id ASC'),
        pool.query('SELECT * FROM public.experience ORDER BY id ASC'),
        pool.query('SELECT * FROM public.skills ORDER BY category ASC, id ASC'),
        pool.query('SELECT * FROM public.certificates ORDER BY id ASC'),
      ]);

      await pool.end();

      return {
        profile: profileRes.rows[0] || null,
        projects: projRes.rows,
        experience: expRes.rows,
        skills: skillsRes.rows,
        certificates: certsRes.rows,
      };
    } catch (err) {
      console.warn('Database fetch failed for resume generator, falling back to default data:', err.message);
    }
  }

  // Verified fallback portfolio data
  return {
    profile: {
      full_name: 'SARAN R',
      title: 'Artificial Intelligence and Machine Learning Engineer',
      email: 'iamsaran.ai@gmail.com',
      phone: '+91 6384957740',
      location: 'Chennai, Tamil Nadu',
      college: 'Panimalar Engineering College',
      degree: 'B.Tech in Artificial Intelligence & Machine Learning',
      graduation_year: '2023 - 2027',
      github_url: 'https://github.com/technosaran',
      linkedin_url: 'https://linkedin.com/in/saran-r-b2b1a5275',
      leetcode_url: 'https://leetcode.com/u/Saran-R/',
    },
    projects: [
      {
        title: 'arthaX - Personal Wealth & Financial Terminal',
        description: 'Full-stack financial terminal for tracking multi-asset personal wealth with sub-30ms PostgreSQL queries and Supabase Row Level Security.',
        tech_stack: ['Next.js 16', 'TypeScript', 'PostgreSQL', 'Supabase RLS', 'Tailwind CSS'],
      },
      {
        title: 'Real-Time Object Detection System',
        description: 'Zero-latency live video stream computer vision application running deep learning visual inference at 60 FPS.',
        tech_stack: ['Python', 'PyTorch', 'OpenCV', 'CUDA', 'Computer Vision'],
      },
      {
        title: 'Named Entity Recognition (NER) NLP Pipeline',
        description: 'Natural Language Processing pipeline extracting structured entities (Names, Organizations, Dates) with 94.8% precision.',
        tech_stack: ['Python', 'NLP', 'SpaCy', 'Bi-LSTM', 'Scikit-Learn'],
      },
    ],
    experience: [
      {
        role: 'AI & ML Intern',
        company: 'Edunet Foundation (in partnership with AICTE & IBM SkillsBuild)',
        period: 'June 2025 - July 2025',
        description: ['Engineered machine learning models using Python and Scikit-Learn; architected an end-to-end AIML capstone project.'],
      },
      {
        role: 'Cloud Computing Intern',
        company: 'CodTech IT Solutions',
        period: 'May 2025 - June 2025',
        description: ['Deployed scalable cloud infrastructure utilizing AWS services and Docker containerization.'],
      },
    ],
    skills: [
      { name: 'Java 21' }, { name: 'Python' }, { name: 'TypeScript' }, { name: 'SQL' },
      { name: 'Next.js 16' }, { name: 'React' }, { name: 'PyTorch' }, { name: 'OpenCV' },
      { name: 'AWS Cloud' }, { name: 'Docker' }, { name: 'Neon PostgreSQL' }, { name: 'Supabase' },
    ],
    certificates: [
      { title: 'Programming using Java', provider: 'Infosys Springboard' },
      { title: 'Oracle Cloud Infrastructure Certified Data Science Professional', provider: 'Oracle University' },
      { title: 'Artificial Intelligence Fundamentals', provider: 'IBM SkillsBuild' },
      { title: 'Introduction to IT & AWS Cloud', provider: 'Amazon Web Services / Coursera' },
    ],
  };
}

function escapePdfText(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildPdfBuffer(data) {
  const p = data.profile;
  const projs = data.projects;
  const exps = data.experience;
  const certs = data.certificates;

  // Stream text instructions
  const ops = [];

  // Title / Name
  ops.push('BT');
  ops.push('/F2 20 Tf');
  ops.push('50 740 Td');
  ops.push(`(${escapePdfText(p.full_name)}) Tj`);

  // Subtitle / Discipline
  ops.push('/F1 11 Tf');
  ops.push('0 -18 Td');
  ops.push(`(${escapePdfText(p.title)}) Tj`);

  // Contact line
  ops.push('/F1 8.5 Tf');
  ops.push('0 -14 Td');
  ops.push(`(Email: ${escapePdfText(p.email)}  |  Phone: ${escapePdfText(p.phone)}  |  Location: ${escapePdfText(p.location)}) Tj`);

  ops.push('0 -12 Td');
  ops.push(`(GitHub: github.com/technosaran  |  LinkedIn: linkedin.com/in/saran-r-b2b1a5275  |  LeetCode: 90+ Solved (Java)) Tj`);

  // Horizontal Rule under Header
  ops.push('ET');
  ops.push('0.2 w');
  ops.push('0.2 0.3 0.5 RG'); // slate/blue accent
  ops.push('50 684 m 562 684 l S');

  // EDUCATION SECTION
  ops.push('BT');
  ops.push('/F2 11 Tf');
  ops.push('50 666 Td');
  ops.push('(EDUCATION) Tj');

  ops.push('/F2 9.5 Tf');
  ops.push('0 -15 Td');
  ops.push(`(${escapePdfText(p.college)} - ${escapePdfText(p.graduation_year)}) Tj`);

  ops.push('/F1 9 Tf');
  ops.push('0 -12 Td');
  ops.push(`(${escapePdfText(p.degree)}) Tj`);

  // CORE TECHNICAL COMPETENCIES
  ops.push('/F2 11 Tf');
  ops.push('0 -20 Td');
  ops.push('(CORE TECHNICAL COMPETENCIES) Tj');

  ops.push('/F1 8.5 Tf');
  ops.push('0 -14 Td');
  ops.push('(Programming Languages: Java 21 (OOP, Collections, DSA), Python 3, TypeScript, JavaScript, SQL) Tj');
  ops.push('0 -12 Td');
  ops.push('(Full-Stack & Cloud: Next.js 16 (App Router), React 19, Node.js, Tailwind CSS 4, AWS Cloud, Docker) Tj');
  ops.push('0 -12 Td');
  ops.push('(AI & Machine Learning: PyTorch, OpenCV (60 FPS Stream), Scikit-Learn, SpaCy (NER Pipeline), Bi-LSTM) Tj');
  ops.push('0 -12 Td');
  ops.push('(Databases & Storage: Neon Serverless PostgreSQL, Supabase RLS, Database Pooling, Drizzle ORM) Tj');
  ops.push('0 -12 Td');
  ops.push('(Algorithmic Problem Solving: 90 LeetCode Problems Solved (81 Easy, 9 Medium) in Java 21) Tj');

  // FEATURED PRODUCTION & RESEARCH SYSTEMS
  ops.push('/F2 11 Tf');
  ops.push('0 -20 Td');
  ops.push('(FEATURED PRODUCTION & RESEARCH SYSTEMS) Tj');

  for (const proj of projs.slice(0, 3)) {
    ops.push('/F2 9.5 Tf');
    ops.push('0 -15 Td');
    const stackStr = Array.isArray(proj.tech_stack) ? ` [${proj.tech_stack.slice(0, 4).join(', ')}]` : '';
    ops.push(`(${escapePdfText(proj.title)}${escapePdfText(stackStr)}) Tj`);

    ops.push('/F1 8.5 Tf');
    ops.push('0 -12 Td');
    const desc = proj.description || '';
    ops.push(`(${escapePdfText(desc.slice(0, 110))}) Tj`);
  }

  // PROFESSIONAL EXPERIENCE
  ops.push('/F2 11 Tf');
  ops.push('0 -20 Td');
  ops.push('(PROFESSIONAL EXPERIENCE) Tj');

  for (const exp of exps.slice(0, 2)) {
    ops.push('/F2 9 Tf');
    ops.push('0 -14 Td');
    ops.push(`(${escapePdfText(exp.role)} - ${escapePdfText(exp.company)}  [${escapePdfText(exp.period)}]) Tj`);

    if (Array.isArray(exp.description) && exp.description[0]) {
      ops.push('/F1 8.5 Tf');
      ops.push('0 -12 Td');
      ops.push(`(${escapePdfText(exp.description[0].slice(0, 115))}) Tj`);
    }
  }

  // CREDENTIALS & CERTIFICATIONS
  ops.push('/F2 11 Tf');
  ops.push('0 -20 Td');
  ops.push('(KEY INDUSTRY CERTIFICATIONS) Tj');

  for (const cert of certs.slice(0, 4)) {
    ops.push('/F1 8.5 Tf');
    ops.push('0 -13 Td');
    ops.push(`(- ${escapePdfText(cert.title)} (${escapePdfText(cert.provider)})) Tj`);
  }

  ops.push('ET');

  const streamContent = ops.join('\n');
  const streamLength = Buffer.byteLength(streamContent, 'utf8');

  // Construct PDF Objects with dynamic offset tracking
  const objects = [];

  // Object 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Object 2: Pages
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // Object 3: Page
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n');

  // Object 4: Stream Contents
  objects.push(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`);

  // Object 5: Helvetica Font
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  // Object 6: Helvetica-Bold Font
  objects.push('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');

  // Calculate exact byte offsets for xref table
  const header = '%PDF-1.4\n%âãÏÓ\n';
  let currentOffset = Buffer.byteLength(header, 'utf8');

  const offsets = [0]; // 0th object
  for (const obj of objects) {
    offsets.push(currentOffset);
    currentOffset += Buffer.byteLength(obj, 'utf8');
  }

  // Build XREF table
  let xref = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    const padded = String(offsets[i]).padStart(10, '0');
    xref += `${padded} 00000 n \n`;
  }

  const startXrefOffset = currentOffset;
  const trailer = `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${startXrefOffset}\n%%EOF\n`;

  const fullPdf = header + objects.join('') + xref + trailer;
  return Buffer.from(fullPdf, 'utf8');
}

async function main() {
  console.log('Fetching verified portfolio data for resume generation...');
  const data = await loadData();

  console.log(`Generating verified PDF for ${data.profile.full_name}...`);
  const pdfBuffer = buildPdfBuffer(data);

  const outputPath = path.join(__dirname, '..', 'public', 'resume.pdf');
  fs.writeFileSync(outputPath, pdfBuffer);

  // Validate output
  const stats = fs.statSync(outputPath);
  const head = pdfBuffer.slice(0, 8).toString('utf8');
  const tail = pdfBuffer.slice(-10).toString('utf8');

  if (!head.startsWith('%PDF-1.4') || !tail.includes('%%EOF')) {
    throw new Error('PDF output validation failed: Invalid PDF header or EOF trailer');
  }

  console.log(`✓ Successfully generated standard-compliant public/resume.pdf (${stats.size} bytes)`);
}

main().catch((err) => {
  console.error('Resume generation failed:', err);
  process.exit(1);
});
