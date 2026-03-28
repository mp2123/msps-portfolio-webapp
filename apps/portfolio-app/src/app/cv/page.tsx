import type { Metadata } from 'next';

import { PublicPageShell } from '@/components/portfolio/public-page-shell';
import { CvDeepDive } from '@/components/cv/cv-deep-dive';
import { PrintToolbar } from '@/components/cv/print-toolbar';
import { WebCv } from '@/components/cv/web-cv';
import { getCanonicalUrl, siteDescription, siteName } from '@/lib/portfolio-site';

export const metadata: Metadata = {
  title: 'Michael Panico | Web CV',
  description: siteDescription,
  alternates: {
    canonical: '/cv',
  },
  openGraph: {
    title: 'Michael Panico | Web CV',
    description: siteDescription,
    url: getCanonicalUrl('/cv'),
    siteName,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Michael Panico web CV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Panico | Web CV',
    description: siteDescription,
    images: ['/twitter-image'],
  },
};

export default function CvPage() {
  return (
    <PublicPageShell className="bg-zinc-950 text-white" chromeClassName="cv-no-print">
      <main id="cv-top" className="cv-page min-h-screen overflow-x-hidden bg-zinc-950 pt-20 text-white">
        <style>{`
          @media print {
            .cv-page {
              background: white !important;
              color: black !important;
            }
            .cv-page * {
              box-shadow: none !important;
            }
            .cv-no-print {
              display: none !important;
            }
            a {
              color: inherit !important;
              text-decoration: none !important;
            }
          }
        `}</style>
        <div className="mx-auto max-w-5xl px-6 py-6">
          <PrintToolbar />
          <WebCv />
          <CvDeepDive />
        </div>
      </main>
    </PublicPageShell>
  );
}
