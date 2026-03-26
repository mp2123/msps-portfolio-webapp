import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteBackground } from "@/components/site-background";
import { getCanonicalUrl, siteDescription, siteName } from "@/lib/portfolio-site";

const resumeUrl = getCanonicalUrl("/resume/michael-panico-resume.pdf");

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3006"),
  title: {
    default: siteName,
    template: "%s | Michael Panico",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background">
        <SiteBackground />
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
