import { ImageResponse } from 'next/og';

import { getSocialImageFacts } from '@/lib/portfolio-site';

export const size = {
  width: 1200,
  height: 675,
};

export const contentType = 'image/png';

export default function TwitterImage() {
  const facts = getSocialImageFacts();

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 20% 15%, rgba(14,165,233,0.24), transparent 22%), radial-gradient(circle at 85% 18%, rgba(99,102,241,0.18), transparent 20%), linear-gradient(135deg, #020617 0%, #0f172a 60%, #000 100%)',
          color: '#fff',
          padding: '56px',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            padding: '44px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: 22, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8bdff0' }}>
              {facts.subtitle}
            </div>
            <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 0.95 }}>
              {facts.title}
            </div>
            <div style={{ fontSize: 28, color: '#cbd5e1', maxWidth: '900px', lineHeight: 1.25 }}>
              {facts.highlight}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {facts.roleTargets.map((role) => (
              <div
                key={role}
                style={{
                  padding: '14px 18px',
                  borderRadius: '999px',
                  background: 'rgba(34,211,238,0.12)',
                  border: '1px solid rgba(34,211,238,0.2)',
                  fontSize: 22,
                }}
              >
                {role}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}

