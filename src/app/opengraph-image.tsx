import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Saran R — AI & ML Engineer | Full-Stack Cloud Architect';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #050609 0%, #0d111c 50%, #050609 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Ambient Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'rgba(56, 189, 248, 0.15)',
            filter: 'blur(80px)',
          }}
        />

        {/* Top Header Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 20px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
              }}
            />
            <span
              style={{
                fontSize: '14px',
                color: '#34d399',
                fontWeight: 600,
                letterSpacing: '1px',
                fontFamily: 'monospace',
              }}
            >
              AVAILABLE FOR 2026/2027 ROLES
            </span>
          </div>

          <span
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            technosaran.vercel.app
          </span>
        </div>

        {/* Center Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '68px',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1.1,
              color: '#ffffff',
            }}
          >
            SARAN R
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#38bdf8',
              letterSpacing: '-0.5px',
            }}
          >
            Artificial Intelligence &amp; Machine Learning Engineer
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#94a3b8',
              maxWidth: '850px',
              lineHeight: 1.5,
            }}
          >
            Full-Stack platforms, cloud infrastructure, computer vision pipelines, and deep learning architectures. Graduating from Panimalar Engineering College (2023–2027).
          </div>
        </div>

        {/* Bottom Tech Stack Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {['Next.js 16', 'TypeScript', 'PyTorch', 'AWS Cloud', 'PostgreSQL', 'Docker', 'Computer Vision'].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#cbd5e1',
                  fontFamily: 'monospace',
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
