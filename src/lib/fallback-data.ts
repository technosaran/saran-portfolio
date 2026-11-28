import type { Profile, Project, Skill, Experience, Certificate } from '@/lib/neon/db';

export const FALLBACK_PROFILE: Profile = {
  id: 1,
  full_name: 'SARAN R',
  title: 'Artificial Intelligence & Machine Learning Engineer',
  headline: 'AI/ML Engineering Student | Cloud Infrastructure & Full-Stack Architect',
  bio: 'Artificial Intelligence and Machine Learning engineering student with hands-on experience in cloud infrastructure (AWS) and full-stack development. Proven ability to architect scalable web applications, implement machine learning models, and solve algorithmic challenges. Passionate about modern software engineering practices, robust database architecture, and building production-grade systems.',
  email: 'iamsaran.ai@gmail.com',
  phone: '+91 6384957740',
  location: 'Chennai, Tamil Nadu',
  college: 'Panimalar Engineering College',
  degree: 'Bachelor of Technology in Artificial Intelligence and Machine Learning',
  graduation_year: '2023 – 2027',
  github_url: 'https://github.com/technosaran',
  linkedin_url: 'https://linkedin.com/in/saran-r-b2b1a5275',
  website_url: 'https://technosaran.vercel.app',
  leetcode_url: 'https://leetcode.com/u/Saran-R/',
};

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'arthaX – Enterprise Personal Financial Management Terminal',
    description:
      'Full-stack wealth terminal for real-time tracking of investments and net worth with a dark-mode financial terminal experience.',
    tech_stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'TailwindCSS'],
    github_url: 'https://github.com/technosaran/arthaX',
    live_url: 'https://arthax.vercel.app',
    highlights: [
      'Architected a full-stack wealth terminal for real-time tracking of investments and net worth.',
      'Engineered secure PostgreSQL database schemas with Row Level Security (RLS) and automated parsing pipelines.',
      'Designed a dark-mode UI with Next.js App Router, cutting client-side load time by 35%.',
    ],
  },
  {
    id: 2,
    title: 'Real-Time Object Detection System',
    description:
      'Live video stream object detection application using deep learning visual inference algorithms.',
    tech_stack: ['Python', 'OpenCV', 'PyTorch', 'Deep Learning'],
    github_url: null,
    live_url: null,
    highlights: [
      'Developed a real-time object detection application using Python and OpenCV for live video stream analysis.',
      'Implemented deep learning visual inference algorithms to perform high-accuracy bounding-box detection.',
    ],
  },
  {
    id: 3,
    title: 'Named Entity Recognition (NER) System using NLP',
    description:
      'NLP text analytics pipeline extracting entities (Names, Locations, Dates) from unstructured datasets with high precision.',
    tech_stack: ['Python', 'NLP', 'SpaCy', 'Scikit-Learn'],
    github_url: null,
    live_url: null,
    highlights: [
      'Engineered an NLP text analytics pipeline to extract critical entities (Names, Locations, Dates) from unstructured text.',
      'Applied advanced tokenization and sequence tagging algorithms to achieve high-precision entity identification.',
    ],
  },
];

export const FALLBACK_EXPERIENCE: Experience[] = [
  {
    id: 1,
    intern_id: 'edunet-ibm-aiml-2025',
    role: 'AI & ML Intern',
    company: 'Edunet Foundation (in partnership with AICTE & IBM SkillsBuild)',
    period: 'June 2025 – July 2025',
    location: 'Remote',
    description: [
      'Engineered machine learning models using Python and Scikit-Learn during an intensive 6-week program via IBM SkillsBuild.',
      'Architected an end-to-end AIML capstone project, applying supervised learning to analyze datasets and improve prediction accuracy.',
    ],
  },
  {
    id: 2,
    intern_id: 'codtech-cloud-2025',
    role: 'Cloud Computing Intern',
    company: 'CodTech IT Solutions',
    period: 'May 2025 – June 2025',
    location: 'Remote',
    description: [
      'Deployed and managed scalable cloud infrastructure utilizing AWS services and Docker containerization.',
      'Optimized application deployment workflows using cloud-native DevOps principles, enhancing system security and scalability.',
    ],
  },
];

export const FALLBACK_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    credential_id: 'INFOSYS-JAVA-2025',
    title: 'Programming using Java',
    provider: 'Infosys Springboard',
    issue_date: '2025',
    url: null,
  },
  {
    id: 2,
    credential_id: 'ORACLE-OCI-DS-2025',
    title: 'Oracle Cloud Infrastructure Certified Data Science Professional',
    provider: 'Oracle University',
    issue_date: '2025',
    url: null,
  },
  {
    id: 3,
    credential_id: 'IBM-AI-FUND-2025',
    title: 'Artificial Intelligence Fundamentals',
    provider: 'IBM SkillsBuild',
    issue_date: '2025',
    url: null,
  },
  {
    id: 4,
    credential_id: 'AWS-COURSERA-IT-2025',
    title: 'Introduction to Information Technology and AWS Cloud',
    provider: 'Amazon Web Services / Coursera',
    issue_date: '2025',
    url: null,
  },
  {
    id: 5,
    credential_id: 'GUVI-PROMPT-ENG-2025',
    title: 'Prompt Engineering for Beginners',
    provider: 'GUVI Geek Networks (Google for Education Partner)',
    issue_date: '2025',
    url: null,
  },
  {
    id: 6,
    credential_id: 'NASSCOM-DATA-GOLD-2025',
    title: 'Acquiring Data: IT-ITeS Sector Skills Council NASSCOM – FutureSkills Prime Gold',
    provider: 'NASSCOM',
    issue_date: '2025',
    url: null,
  },
];

export const FALLBACK_SKILLS: Skill[] = [
  { id: 1, name: 'Java', category: 'Programming Languages', level: 'Expert' },
  { id: 2, name: 'JavaScript', category: 'Programming Languages', level: 'Advanced' },
  { id: 3, name: 'TypeScript', category: 'Programming Languages', level: 'Advanced' },
  { id: 4, name: 'Python', category: 'Programming Languages', level: 'Expert' },
  { id: 5, name: 'SQL', category: 'Programming Languages', level: 'Advanced' },
  { id: 6, name: 'Next.js', category: 'Web & Backend Frameworks', level: 'Expert' },
  { id: 7, name: 'React.js', category: 'Web & Backend Frameworks', level: 'Expert' },
  { id: 8, name: 'Node.js', category: 'Web & Backend Frameworks', level: 'Advanced' },
  { id: 9, name: 'Express.js', category: 'Web & Backend Frameworks', level: 'Advanced' },
  { id: 10, name: 'TailwindCSS', category: 'Web & Backend Frameworks', level: 'Expert' },
  { id: 11, name: 'RESTful APIs', category: 'Web & Backend Frameworks', level: 'Advanced' },
  { id: 12, name: 'Microservices', category: 'Web & Backend Frameworks', level: 'Proficient' },
  { id: 13, name: 'PyTorch', category: 'AI/ML & Cloud', level: 'Advanced' },
  { id: 14, name: 'OpenCV', category: 'AI/ML & Cloud', level: 'Advanced' },
  { id: 15, name: 'Scikit-Learn', category: 'AI/ML & Cloud', level: 'Advanced' },
  { id: 16, name: 'SpaCy', category: 'AI/ML & Cloud', level: 'Advanced' },
  { id: 17, name: 'Pandas', category: 'AI/ML & Cloud', level: 'Expert' },
  { id: 18, name: 'NumPy', category: 'AI/ML & Cloud', level: 'Advanced' },
  { id: 19, name: 'AWS Cloud', category: 'Cloud & DevOps', level: 'Advanced' },
  { id: 20, name: 'Docker', category: 'Cloud & DevOps', level: 'Advanced' },
  { id: 21, name: 'DevOps & CI/CD', category: 'Cloud & DevOps', level: 'Proficient' },
  { id: 22, name: 'Vercel', category: 'Cloud & DevOps', level: 'Expert' },
  { id: 23, name: 'Render', category: 'Cloud & DevOps', level: 'Advanced' },
  { id: 24, name: 'Git & GitHub', category: 'Cloud & DevOps', level: 'Expert' },
  { id: 25, name: 'PostgreSQL', category: 'Databases & Developer Tools', level: 'Advanced' },
  { id: 26, name: 'Supabase', category: 'Databases & Developer Tools', level: 'Advanced' },
  { id: 27, name: 'MongoDB', category: 'Databases & Developer Tools', level: 'Proficient' },
  { id: 28, name: 'Neon', category: 'Databases & Developer Tools', level: 'Advanced' },
  { id: 29, name: 'Data Structures & Algorithms', category: 'Core CS Fundamentals', level: 'Advanced' },
  { id: 30, name: 'OOP', category: 'Core CS Fundamentals', level: 'Expert' },
  { id: 31, name: 'DBMS', category: 'Core CS Fundamentals', level: 'Advanced' },
  { id: 32, name: 'Operating Systems', category: 'Core CS Fundamentals', level: 'Proficient' },
  { id: 33, name: 'Computer Networks', category: 'Core CS Fundamentals', level: 'Proficient' },
  { id: 34, name: 'Software Engineering (SDLC/Agile)', category: 'Core CS Fundamentals', level: 'Advanced' },
];
