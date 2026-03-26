import { ImageResponse } from 'next/og';

import { getSocialImageFacts } from '@/lib/portfolio-site';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  const facts = getSocialImageFacts();

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at top left, rgba(34,211,238,0.25), transparent 28%), linear-gradient(135deg, #050816 0%, #0a1220 55%, #000 100%)',
          color: '#fff',
          padding: '64px',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '32px',
            padding: '48px',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '999px', background: '#22d3ee' }} />
              <div style={{ fontSize: 24, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8bdff0' }}>
                Business Analytics / BI
              </div>
            </div>
            <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 0.95 }}>
              {facts.title}
            </div>
            <div style={{ fontSize: 30, color: '#c6d4e6', maxWidth: '920px', lineHeight: 1.25 }}>
              {facts.summary}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {facts.metrics.map((metric) => (
              <div
                key={metric.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: '220px',
                  padding: '18px 20px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7dd3fc' }}>
                  {metric.label}
                </div>
                <div style={{ marginTop: '10px', fontSize: 30, fontWeight: 700 }}>{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
