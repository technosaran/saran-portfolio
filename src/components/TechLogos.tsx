import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

// 1. Python
export function PythonLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M63.39 2C47.28 2 34.8 7.37 34.8 19.38v10.97h29.17v3.66H23.51C11.51 34.01 2 44.07 2 60.19c0 16.11 8.28 25.74 20.37 25.74h8.37V73.74c0-8.23 7.02-15.42 15.42-15.42h28.91c7.2 0 13.06-5.86 13.06-13.06V19.38C88.13 7.37 79.5 2 63.39 2zM50.15 10.23c2.93 0 5.3 2.37 5.3 5.3 0 2.93-2.37 5.3-5.3 5.3-2.93 0-5.3-2.37-5.3-5.3 0-2.93 2.37-5.3 5.3-5.3z"
        fill="url(#py-blue)"
      />
      <path
        d="M64.61 126c16.11 0 28.59-5.37 28.59-17.38V97.65H64.03v-3.66h40.46c12 0 21.51-10.06 21.51-26.18 0-16.11-8.28-25.74-20.37-25.74h-8.37v12.19c0 8.23-7.02 15.42-15.42 15.42H52.93c-7.2 0-13.06 5.86-13.06 13.06v25.88C39.87 120.63 48.5 126 64.61 126zm13.24-8.23c-2.93 0-5.3-2.37-5.3-5.3 0-2.93 2.37-5.3 5.3-5.3 2.93 0 5.3 2.37 5.3 5.3 0 2.93-2.37 5.3-5.3 5.3z"
        fill="url(#py-yellow)"
      />
      <defs>
        <linearGradient id="py-blue" x1="16.48" y1="9.49" x2="74.79" y2="67.8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#387EB8" />
          <stop offset="1" stopColor="#366994" />
        </linearGradient>
        <linearGradient id="py-yellow" x1="43.23" y1="56.63" x2="114.73" y2="128.13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE873" />
          <stop offset="1" stopColor="#FFD43B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 2. Java
export function JavaLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M48.8 82.2s-7.1 4.1 5 5.5c14.7 1.7 22.3 1.4 38.6-2 0 0 5.6 3.6-6.1 6.5-22.3 5.5-56.1 4.3-64.8-1.5-3.3-2.2 4-6.3 13.1-7.9 4.3-.8 14.2-.6 14.2-.6z"
        fill="#5382A1"
      />
      <path
        d="M44.5 69.2s-8 5.7 4.1 7.2c15.1 1.9 27.6 2.1 47.9-2.9 0 0 4.1 4-7.4 7-23.7 6.1-66.2 5.1-74.8-1.7-3.4-2.7 4.7-6.9 15.6-8.6 5.1-.8 14.6-1 14.6-1z"
        fill="#5382A1"
      />
      <path
        d="M74.9 45.4s8.9 9-8.4 22.8c-14.1 11.2-3.1 17.6 0 25.1-7.8-8.9-13.6-16.7-9.8-24.1 5-9.6 23.3-14.4 18.2-23.8z"
        fill="#E76F00"
      />
      <path
        d="M87.4 34.3s13.4 13.5-12.7 34.2c-21.2 16.8-4.7 26.5 0 37.7-11.7-13.3-20.4-25.1-14.7-36.2 7.6-14.5 35-21.6 27.4-35.7z"
        fill="#E76F00"
      />
      <path
        d="M62.6 12.3s15.7 15.8-14.9 40.1c-24.8 19.8-5.5 31.1 0 44.3-13.7-15.6-23.9-29.5-17.2-42.5 8.9-17 41-25.3 32.1-41.9z"
        fill="#E76F00"
      />
      <path
        d="M93.3 97.4c-22.3 5.5-56.1 4.3-64.8-1.5-1.9-1.3 1.1-3.3 5.8-4.9 14.5-2.2 38.6-4.5 54.3-7.7 7.2-1.5 12.8 1.5 12.8 1.5s5 3.3-8.1 12.6z"
        fill="#5382A1"
      />
      <path
        d="M34.8 111.4c22.3 1.7 46.1-.7 63.8-8.2 0 0-4.5 4.5-18.7 8.2-19.5 5.1-48.4 4.5-59.5-1.5 0 0 4.1-1.2 14.4 1.5z"
        fill="#5382A1"
      />
    </svg>
  );
}

// 3. TypeScript
export function TypeScriptLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="16" fill="#3178C6" />
      <path
        d="M71.2 50.1V60H57.9v52.6H44.6V60H31.3v-9.9h39.9zm41.6 22.8c-1.8-1.4-4.5-2.8-8-4.2-3.6-1.4-6.3-2.7-8.1-4-2.8-1.9-4.2-4.5-4.2-7.8 0-3.3 1.4-6 4.3-8 2.8-2 6.7-3 11.6-3 4.3 0 8.3.9 12.1 2.6 3.7 1.7 6.7 4.1 8.9 7.1l-8.5 6.3c-1.3-1.8-3-3.2-5.1-4.2-2.1-1-4.5-1.5-7.1-1.5-2.6 0-4.6.5-6 1.5-1.4 1-2.1 2.3-2.1 4 0 1.4.6 2.5 1.7 3.4 1.1.9 3.2 1.8 6.2 2.9 3.8 1.4 6.9 2.8 9.2 4.2 3.1 1.9 4.7 4.6 4.7 8.2 0 3.7-1.5 6.6-4.6 8.9-3.1 2.2-7.4 3.3-13 3.3-5 0-9.7-1.1-14.2-3.3-4.5-2.2-7.8-5.3-9.9-9.3l8.9-5.9c1.4 2.5 3.3 4.4 5.9 5.8 2.6 1.4 5.7 2.1 9.4 2.1 2.9 0 5.2-.6 6.8-1.7 1.6-1.1 2.4-2.6 2.4-4.5 0-1.6-.7-2.9-2.1-3.9z"
        fill="white"
      />
    </svg>
  );
}

// 4. JavaScript
export function JavaScriptLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="16" fill="#F7DF1E" />
      <path
        d="M33.6 109.8c3.2 5.1 7.4 8.7 14.5 8.7 6.1 0 10.6-2.9 10.6-14.3V44.2h15.2v60.2c0 19.3-10.9 27.6-26.1 27.6-11.8 0-19.7-5.8-23.7-14.5l9.5-7.7zm49.1-1.1c3.5 6 8.3 10.4 16.5 10.4 7.2 0 12-3.6 12-8.7 0-6-4.8-8.2-12.8-11.7-11.6-5-19.1-11.4-19.1-24.8 0-12.3 9.4-21.7 23.9-21.7 10.4 0 18 4.3 22.9 12.9l-10.6 6.8c-2.4-4.3-5.5-6.4-12.3-6.4-5.3 0-9.2 3.3-9.2 7.4 0 5.2 3.6 7.4 11.8 10.9 13.6 5.8 20.3 12 20.3 25.7 0 14.7-11.6 23.3-27.1 23.3-15.4 0-24.8-8-28.9-16.7l12.6-7.3z"
        fill="#323330"
      />
    </svg>
  );
}

// 5. Next.js
export function NextjsLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="64" fill="black" />
      <path
        d="M104.9 107.5L52.8 40.5H41v46.9h8.3V52.8l48 61.8c2.6-2.1 5.1-4.4 7.6-7.1z"
        fill="url(#next-gradient)"
      />
      <rect x="78.7" y="40.5" width="8.3" height="46.9" fill="white" />
      <defs>
        <linearGradient id="next-gradient" x1="68" y1="67.5" x2="98" y2="106.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 6. React
export function ReactLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="11" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="6" fill="none">
        <ellipse cx="64" cy="64" rx="55" ry="21" />
        <ellipse cx="64" cy="64" rx="55" ry="21" transform="rotate(60 64 64)" />
        <ellipse cx="64" cy="64" rx="55" ry="21" transform="rotate(120 64 64)" />
      </g>
    </svg>
  );
}

// 7. Node.js
export function NodejsLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M64 4l52 30v60L64 124 12 94V34L64 4z"
        fill="#339933"
      />
      <path
        d="M64 25.5l37.2 21.5v43L64 111.5 26.8 90v-43L64 25.5z"
        fill="#026E00"
      />
      <path
        d="M64 42l23 13.3v26.7L64 95.3 41 82V55.3L64 42z"
        fill="#83CD29"
      />
    </svg>
  );
}

// 8. PyTorch
export function PyTorchLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M74.8 18.2L64 7.4l-10.8 10.8C35.9 35.5 35.9 64.1 53.2 81.4c17.3 17.3 45.9 17.3 63.2 0 17.3-17.3 17.3-45.9 0-63.2L105.6 7.4l-10.8 10.8c11.4 11.4 11.4 30.1 0 41.5-11.4 11.4-30.1 11.4-41.5 0-11.4-11.4-11.4-30.1 0-41.5l10.8-10.8 10.7 10.8z"
        fill="#EE4C2C"
      />
      <circle cx="94.8" cy="28.9" r="6" fill="#EE4C2C" />
    </svg>
  );
}

// 9. OpenCV
export function OpenCVLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Red Circle */}
      <circle cx="64" cy="38" r="28" stroke="#EA2027" strokeWidth="12" fill="none" />
      {/* Green Circle */}
      <circle cx="40" cy="80" r="28" stroke="#009432" strokeWidth="12" fill="none" />
      {/* Blue Circle */}
      <circle cx="88" cy="80" r="28" stroke="#0652DD" strokeWidth="12" fill="none" />
    </svg>
  );
}

// 10. PostgreSQL
export function PostgreSQLLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="62" fill="#336791" />
      <path
        d="M64 22c-23.2 0-42 18.8-42 42 0 17.8 11.1 33 26.8 39v-13c-8.9-4.8-15-14.3-15-25.2 0-15.9 12.9-28.8 28.8-28.8s28.8 12.9 28.8 28.8c0 10.9-6.1 20.4-15 25.2v13c15.7-6 26.8-21.2 26.8-39 0-23.2-18.8-42-42-42z"
        fill="white"
      />
      <circle cx="52" cy="56" r="6" fill="white" />
      <circle cx="76" cy="56" r="6" fill="white" />
      <path
        d="M64 68v24M54 84h20"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 11. Docker
export function DockerLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M124.8 62.4c-2.4-1.6-7.8-2.4-12.8-.8-1.6-4.8-5.6-8.8-10.4-10.4l-3.2-1.6-.8 3.2c-.8 4.8 1.6 9.6 4.8 12.8-3.2 1.6-8.8 1.6-13.6.8-4-8-12-13.6-20.8-13.6H16c-1.6 0-3.2 1.6-3.2 3.2v24.8C12.8 104 36.8 120 64 120c38.4 0 62.4-23.2 62.4-44.8 0-4.8-.8-9.6-1.6-12.8z"
        fill="#2496ED"
      />
      {/* Containers */}
      <rect x="24" y="52" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
      <rect x="37" y="52" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
      <rect x="50" y="52" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
      <rect x="37" y="40" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
      <rect x="50" y="40" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
      <rect x="63" y="40" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
      <rect x="50" y="28" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
      <rect x="63" y="28" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
      <rect x="76" y="40" width="10" height="9" rx="1.5" fill="#2496ED" stroke="#0d1117" strokeWidth="1.5" />
    </svg>
  );
}

// 12. AWS Cloud
export function AWSLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M37.6 57.6c0 4.8 1.6 8.8 4.8 12 3.2 3.2 7.2 4.8 12 4.8 4.8 0 8.8-1.6 12-4.8 3.2-3.2 4.8-7.2 4.8-12V32h-9.6v25.6c0 2.4-.8 4.8-2.4 6.4-1.6 1.6-4 2.4-6.4 2.4s-4.8-.8-6.4-2.4c-1.6-1.6-2.4-4-2.4-6.4V32H37.6v25.6zm44.8 16.8h9.6L104 32h-10.4l-7.2 27.2L79.2 32h-9.6l12.8 42.4z"
        fill="white"
      />
      {/* Amazon Smile Arrow */}
      <path
        d="M24 88c24 16 56 16 80 0"
        stroke="#FF9900"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M96 82l9 6-1 10"
        stroke="#FF9900"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 13. Supabase
export function SupabaseLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M72.2 121.8c-3.1 3.9-9.4 1.7-9.4-3.3V73.4H13.6c-4.4 0-6.9-5-4.2-8.5L55.8 6.2c3.1-3.9 9.4-1.7 9.4 3.3v45.1h49.2c4.4 0 6.9 5 4.2 8.5L72.2 121.8z"
        fill="url(#sb-gradient)"
      />
      <defs>
        <linearGradient id="sb-gradient" x1="16" y1="12" x2="108" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3ECF8E" />
          <stop offset="1" stopColor="#1E8E5A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 14. MongoDB
export function MongoDBLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M64 4c-3.8 9.6-32 36.5-32 64 0 21 14.8 38.6 30.6 47.4 1.2.6 1.4 2.2 1.4 3.6v5c0 1.2 1 2 2.2 1.6 11.2-3.8 29.8-19.4 29.8-49.6C96 42.4 71.4 15.6 64 4z"
        fill="#47A248"
      />
      <path
        d="M64 4v121c0 1.2 1 2 2.2 1.6 11.2-3.8 29.8-19.4 29.8-49.6C96 42.4 71.4 15.6 64 4z"
        fill="#499D4A"
      />
      <path
        d="M64 12c-1.2 1.4-1.8 3.2-1.8 5v94c0 1.2.6 2.2 1.8 2.8 1.2-.6 1.8-1.6 1.8-2.8V17c0-1.8-.6-3.6-1.8-5z"
        fill="#FFFFFF"
        opacity="0.8"
      />
    </svg>
  );
}

// 15. Git
export function GitLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M124.7 57.6L70.4 3.3c-4.4-4.4-11.6-4.4-16 0L43.8 13.9l19.5 19.5c4.7-1.6 10.2-.5 13.9 3.2 3.7 3.7 4.8 9.2 3.2 13.9l18.8 18.8c4.7-1.6 10.2-.5 13.9 3.2 5.5 5.5 5.5 14.4 0 19.9s-14.4 5.5-19.9 0c-4-4-5-9.8-3-14.6L72.8 69.4v30.9c1.9 1.1 3.5 2.7 4.6 4.7 3.7 6.4 1.5 14.6-4.9 18.3s-14.6 1.5-18.3-4.9c-3.7-6.4-1.5-14.6 4.9-18.3 2.5-1.5 5.5-2 8.3-1.6V66.8c-2.8.4-5.8-.1-8.3-1.6-4-2.3-6.5-6.5-6.5-11.1 0-2.3.6-4.5 1.7-6.5L34.5 23.3 3.3 54.5c-4.4 4.4-4.4 11.6 0 16l54.3 54.3c4.4 4.4 11.6 4.4 16 0l51.1-51.1c4.4-4.5 4.4-11.7 0-16.1z"
        fill="#F05032"
      />
    </svg>
  );
}

// 16. TailwindCSS
export function TailwindLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M64 36c-18.7 0-28 9.3-28 28 4.7-9.3 11.7-14 21-14 10.5 0 16.3 7 24.5 15.2C89.5 73.4 99.8 84 120 84c18.7 0 28-9.3 28-28-4.7 9.3-11.7 14-21 14-10.5 0-16.3-7-24.5-15.2C94.5 46.6 84.2 36 64 36zM8 64c-18.7 0-28 9.3-28 28 4.7-9.3 11.7-14 21-14 10.5 0 16.3 7 24.5 15.2C33.5 101.4 43.8 112 64 112c18.7 0 28-9.3 28-28-4.7 9.3-11.7 14-21 14-10.5 0-16.3-7-24.5-15.2C38.5 74.6 28.2 64 8 64z"
        fill="#38BDF8"
      />
    </svg>
  );
}

// 17. Scikit-Learn
export function ScikitLearnLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M64 16c26.5 0 48 21.5 48 48s-21.5 48-48 48S16 90.5 16 64s21.5-48 48-48z"
        fill="#F89939"
      />
      <path
        d="M64 24c22.1 0 40 17.9 40 40s-17.9 40-40 40S24 86.1 24 64s17.9-40 40-40z"
        fill="#3499CD"
      />
      <circle cx="50" cy="56" r="10" fill="white" />
      <circle cx="78" cy="72" r="12" fill="white" />
      <path d="M50 56L78 72" stroke="white" strokeWidth="5" />
    </svg>
  );
}

// 18. Pandas
export function PandasLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="24" width="20" height="80" rx="6" fill="#130754" />
      <rect x="54" y="44" width="20" height="60" rx="6" fill="#FF4A00" />
      <rect x="88" y="24" width="20" height="80" rx="6" fill="#E70488" />
      <circle cx="64" cy="28" r="10" fill="#FFD43B" />
    </svg>
  );
}

// 19. NumPy
export function NumPyLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#013243" />
      <path
        d="M32 40v48l24-14V26L32 40zm36-14v48l28-14V26L68 26zm-28 62l24 14 28-14-24-14-28 14z"
        fill="#4DABCF"
      />
    </svg>
  );
}

// 20. Vercel
export function VercelLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="62" fill="black" stroke="white" strokeWidth="4" />
      <path d="M64 28L104 96H24L64 28z" fill="white" />
    </svg>
  );
}

// 21. Express.js
export function ExpressLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="24" fill="#1f232b" />
      <text
        x="64"
        y="78"
        textAnchor="middle"
        fontSize="44"
        fontFamily="monospace"
        fontWeight="bold"
        fill="white"
      >
        ex
      </text>
    </svg>
  );
}

// 22. SpaCy
export function SpaCyLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#09A3D5" />
      <circle cx="64" cy="64" r="26" fill="white" />
      <path d="M64 26v76M26 64h76M37 37l54 54M91 37L37 91" stroke="#09A3D5" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

// 23. SQL
export function SQLLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="64" cy="32" rx="42" ry="16" fill="#00758F" />
      <path
        d="M22 32v64c0 8.8 18.8 16 42 16s42-7.2 42-16V32"
        stroke="#F29111"
        strokeWidth="10"
        fill="none"
      />
      <ellipse cx="64" cy="64" rx="42" ry="14" stroke="#F29111" strokeWidth="8" fill="none" />
      <ellipse cx="64" cy="96" rx="42" ry="14" fill="#00758F" />
    </svg>
  );
}

// 24. DSA & Algorithms
export function DSALogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="28" r="14" fill="#3B82F6" />
      <circle cx="34" cy="74" r="14" fill="#6366F1" />
      <circle cx="94" cy="74" r="14" fill="#6366F1" />
      <circle cx="20" cy="108" r="10" fill="#38BDF8" />
      <circle cx="48" cy="108" r="10" fill="#38BDF8" />
      <line x1="64" y1="28" x2="34" y2="74" stroke="#93C5FD" strokeWidth="6" />
      <line x1="64" y1="28" x2="94" y2="74" stroke="#93C5FD" strokeWidth="6" />
      <line x1="34" y1="74" x2="20" y2="108" stroke="#93C5FD" strokeWidth="5" />
      <line x1="34" y1="74" x2="48" y2="108" stroke="#93C5FD" strokeWidth="5" />
    </svg>
  );
}

// 25. REST API
export function APILogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="28" width="100" height="72" rx="14" fill="#0284C7" />
      <text
        x="64"
        y="74"
        textAnchor="middle"
        fontSize="34"
        fontFamily="monospace"
        fontWeight="900"
        fill="white"
        letterSpacing="2"
      >
        API
      </text>
    </svg>
  );
}

// 26. Microservices & Distributed
export function MicroservicesLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="18" width="36" height="36" rx="8" fill="#38BDF8" />
      <rect x="74" y="18" width="36" height="36" rx="8" fill="#818CF8" />
      <rect x="46" y="74" width="36" height="36" rx="8" fill="#34D399" />
      <line x1="36" y1="54" x2="64" y2="74" stroke="white" strokeWidth="5" strokeDasharray="4 4" />
      <line x1="92" y1="54" x2="64" y2="74" stroke="white" strokeWidth="5" strokeDasharray="4 4" />
      <line x1="54" y1="36" x2="74" y2="36" stroke="white" strokeWidth="5" />
    </svg>
  );
}

// 27. CI/CD & DevOps
export function DevOpsLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Infinity shape */}
      <path
        d="M40 44c-11 0-20 9-20 20s9 20 20 20c13 0 20-14 24-20 4-6 11-20 24-20 11 0 20 9 20 20s-9 20-20 20c-13 0-20-14-24-20-4-6-11-20-24-20z"
        stroke="#06B6D4"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// 28. Operating Systems / Linux
export function OSLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#0f172a" />
      <path d="M24 38h80v60H24z" rx="6" stroke="#38bdf8" strokeWidth="6" fill="#1e293b" />
      <path d="M40 56l14 12-14 12M62 80h24" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 29. Computer Networks
export function NetworksLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="30" r="14" fill="#6366f1" />
      <circle cx="28" cy="98" r="14" fill="#3b82f6" />
      <circle cx="100" cy="98" r="14" fill="#3b82f6" />
      <path d="M64 44v34M28 84l36-6M100 84l-36-6" stroke="#818cf8" strokeWidth="6" strokeLinecap="round" />
      <circle cx="64" cy="78" r="6" fill="#a5b4fc" />
    </svg>
  );
}

// 30. Object-Oriented Programming (OOP)
export function OOPLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="40" height="40" rx="8" fill="#f59e0b" />
      <rect x="68" y="68" width="40" height="40" rx="8" fill="#3b82f6" />
      <path d="M60 40h28v28" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="40" r="4" fill="#fbbf24" />
      <circle cx="88" cy="68" r="4" fill="#60a5fa" />
    </svg>
  );
}

// 31. Oracle
export function OracleLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="24" fill="#F80000" />
      <path
        d="M64 42c-15.5 0-28 9.9-28 22s12.5 22 28 22 28-9.9 28-22-12.5-22-28-22zm0 33c-8.8 0-16-4.9-16-11s7.2-11 16-11 16 4.9 16 11-7.2 11-16 11z"
        fill="white"
      />
    </svg>
  );
}

// 32. IBM
export function IBMLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#0F62FE" />
      <g fill="white">
        <rect x="24" y="32" width="20" height="6" />
        <rect x="54" y="32" width="20" height="6" />
        <rect x="84" y="32" width="20" height="6" />
        <rect x="24" y="42" width="20" height="6" />
        <rect x="54" y="42" width="20" height="6" />
        <rect x="84" y="42" width="20" height="6" />
        <rect x="24" y="52" width="20" height="6" />
        <rect x="54" y="52" width="20" height="6" />
        <rect x="84" y="52" width="20" height="6" />
        <rect x="24" y="62" width="20" height="6" />
        <rect x="54" y="62" width="20" height="6" />
        <rect x="84" y="62" width="20" height="6" />
        <rect x="24" y="72" width="20" height="6" />
        <rect x="54" y="72" width="20" height="6" />
        <rect x="84" y="72" width="20" height="6" />
        <rect x="24" y="82" width="20" height="6" />
        <rect x="54" y="82" width="20" height="6" />
        <rect x="84" y="82" width="20" height="6" />
        <rect x="24" y="92" width="20" height="6" />
        <rect x="54" y="92" width="20" height="6" />
        <rect x="84" y="92" width="20" height="6" />
      </g>
    </svg>
  );
}

// 33. Infosys
export function InfosysLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#007CC3" />
      <text
        x="64"
        y="76"
        textAnchor="middle"
        fontSize="30"
        fontFamily="sans-serif"
        fontWeight="800"
        fill="white"
        letterSpacing="-0.5"
      >
        Infosys
      </text>
    </svg>
  );
}

// 34. Coursera
export function CourseraLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#0056D2" />
      <path
        d="M78 40a28 28 0 1 0 0 48l-8-12a14 14 0 1 1 0-24l8-12z"
        fill="white"
      />
    </svg>
  );
}

// 35. Google
export function GoogleLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="white" />
      <path
        d="M98 65.5c0-2.4-.2-4.7-.6-7H64v13.3h19.1c-.8 4.4-3.3 8.2-7 10.7v8.9h11.4c6.7-6.2 10.5-15.3 10.5-25.9z"
        fill="#4285F4"
      />
      <path
        d="M64 100c9.7 0 17.9-3.2 23.8-8.7L76.4 82.4c-3.2 2.2-7.4 3.4-12.4 3.4-9.5 0-17.6-6.4-20.5-15.1H31.7v9.2C37.6 91.5 49.9 100 64 100z"
        fill="#34A853"
      />
      <path
        d="M43.5 70.7c-.7-2.2-1.1-4.5-1.1-6.7s.4-4.5 1.1-6.7V48.1H31.7c-2.4 4.8-3.7 10.3-3.7 15.9s1.3 11.1 3.7 15.9l11.8-9.2z"
        fill="#FBBC05"
      />
      <path
        d="M64 42.2c5.3 0 10 1.8 13.8 5.4l10.3-10.3C81.9 31.5 73.7 28 64 28c-14.1 0-26.4 8.5-32.3 20.1l11.8 9.2c2.9-8.7 11-15.1 20.5-15.1z"
        fill="#EA4335"
      />
    </svg>
  );
}

// 36. LeetCode
export function LeetCodeLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#1A1A1A" />
      <path
        d="M78 36l-26 26a4 4 0 0 0 0 5.6l26 26"
        stroke="#FFA116"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M58 84h34"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 37. Neon DB
export function NeonLogo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#000000" />
      <path
        d="M32 96V32l40 40V32h24v64L56 56v40H32z"
        fill="#00E599"
      />
    </svg>
  );
}

// 38. Default / Fallback Tech Vector
export function GenericTechLogo({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  const initial = name.slice(0, 2).toUpperCase();
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="20" fill="#1e293b" stroke="#3b82f6" strokeWidth="6" />
      <text
        x="64"
        y="78"
        textAnchor="middle"
        fontSize="40"
        fontFamily="monospace"
        fontWeight="bold"
        fill="#93c5fd"
      >
        {initial}
      </text>
    </svg>
  );
}

// Unified Resolver: Returns the authentic high-resolution SVG logo component
export function getSkillLogo(name: string): React.ComponentType<{ className?: string }> {
  const n = name.toLowerCase().trim();

  if (n === 'python') return PythonLogo;
  if (n === 'java') return JavaLogo;
  if (n === 'typescript' || n === 'ts') return TypeScriptLogo;
  if (n === 'javascript' || n === 'js') return JavaScriptLogo;
  if (n.includes('next')) return NextjsLogo;
  if (n.includes('react')) return ReactLogo;
  if (n.includes('node')) return NodejsLogo;
  if (n.includes('express')) return ExpressLogo;
  if (n.includes('pytorch') || n.includes('torch')) return PyTorchLogo;
  if (n.includes('opencv')) return OpenCVLogo;
  if (n.includes('postgres') || n.includes('postgresql')) return PostgreSQLLogo;
  if (n.includes('docker')) return DockerLogo;
  if (n.includes('aws') || n.includes('cloud')) return AWSLogo;
  if (n.includes('supabase')) return SupabaseLogo;
  if (n.includes('mongo') || n.includes('mongodb')) return MongoDBLogo;
  if (n.includes('git')) return GitLogo;
  if (n.includes('tailwind')) return TailwindLogo;
  if (n.includes('scikit') || n.includes('sklearn')) return ScikitLearnLogo;
  if (n.includes('pandas')) return PandasLogo;
  if (n.includes('numpy')) return NumPyLogo;
  if (n.includes('vercel')) return VercelLogo;
  if (n.includes('neon')) return NeonLogo;
  if (n.includes('oracle')) return OracleLogo;
  if (n.includes('ibm')) return IBMLogo;
  if (n.includes('infosys')) return InfosysLogo;
  if (n.includes('coursera')) return CourseraLogo;
  if (n.includes('google')) return GoogleLogo;
  if (n.includes('leetcode')) return LeetCodeLogo;
  if (n.includes('spacy')) return SpaCyLogo;
  if (n === 'sql' || n.includes('mysql') || n.includes('database') || n === 'dbms') return SQLLogo;
  if (n.includes('data structure') || n.includes('dsa') || n.includes('algorithm')) return DSALogo;
  if (n.includes('api') || n.includes('rest')) return APILogo;
  if (n.includes('microservice')) return MicroservicesLogo;
  if (n.includes('devops') || n.includes('ci/cd') || n.includes('sdlc') || n.includes('software')) return DevOpsLogo;
  if (n.includes('operating system') || n === 'os' || n.includes('linux')) return OSLogo;
  if (n.includes('network')) return NetworksLogo;
  if (n.includes('oop') || n.includes('object-oriented')) return OOPLogo;

  return function Fallback({ className }: { className?: string }) {
    return <GenericTechLogo name={name} className={className} />;
  };
}
