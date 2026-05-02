import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getCanonicalUrl, getSiteUrl, siteDescription, siteName } from "@/lib/portfolio-site";
import { FramerProvider } from "@/components/providers/framer-provider";
import { Sora, Inter } from "next/font/google";
import { DynamicSiteBackground } from "@/components/dynamic-site-background";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const resumeUrl = getCanonicalUrl("/resume/michael-panico-resume.pdf");

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Michael Panico | Home | Business Analytics & Operations",
    template: "Michael Panico | %s | Business Analytics & Operations",
  },
  description: siteDescription,
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: getCanonicalUrl("/"),
    siteName,
    type: "profile",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Michael Panico portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased bg-background ${sora.variable} ${inter.variable}`}>
        <DynamicSiteBackground />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${getCanonicalUrl("/")}#person`,
                  name: "Michael Panico",
                  jobTitle: "Business Analytics / BI / Automation",
                  description: siteDescription,
                  url: getCanonicalUrl("/"),
                  email: "mailto:michael_s_panico@outlook.com",
                  sameAs: [
                    "https://www.linkedin.com/in/michaelspanico",
                    "https://github.com/mp2123",
                    resumeUrl,
                  ],
                  subjectOf: {
                    "@type": "CreativeWork",
                    name: "Michael Panico one-page resume",
                    url: resumeUrl,
                  },
                  knowsAbout: [
                    "Power BI",
                    "SQL",
                    "Python",
                    "Workflow Automation",
                    "Business Intelligence",
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Phoenix",
                    addressRegion: "AZ",
                    addressCountry: "US",
                  },
                },
                {
                  "@type": "ProfilePage",
                  "@id": `${getCanonicalUrl("/")}#profile`,
                  name: siteName,
                  url: getCanonicalUrl("/"),
                  about: {
                    "@id": `${getCanonicalUrl("/")}#person`,
                  },
                  primaryImageOfPage: {
                    "@type": "ImageObject",
                    url: getCanonicalUrl("/opengraph-image"),
                  },
                },
              ],
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FramerProvider>
            {children}
          </FramerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
