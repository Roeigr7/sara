import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";

/** Google Search Console — keep this meta tag after verification (do not remove). */
const GOOGLE_SITE_VERIFICATION_DEFAULT =
  "TBEJ7dzmi2oJE8gDcEpX3bFVr166mlpO8XU28fY6EI8";
const fromEnv = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
// Ignore empty or placeholder values (e.g. if Vercel env was set to the old template)
const googleSiteVerification =
  fromEnv &&
  fromEnv !== "your-google-site-verification-code" &&
  !fromEnv.startsWith("your-google-")
    ? fromEnv
    : GOOGLE_SITE_VERIFICATION_DEFAULT;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "עורכת דין שרה מיכל אדרי - משפט אזרחי ומעמד אישי | ישראל",
  description: "עורכת דין שרה מיכל אדרי מתמחה במשפט אזרחי, מעמד אישי, צוואות, ייפוי כוח מתמשך ונדל״ן. שירות משפטי מקצועי ואמין עם ניסיון של שנים. צור קשר: 050-6466711",
  keywords: "עורך דין, עורכת דין, משפט אזרחי, מעמד אישי, צוואות, ייפוי כוח מתמשך, נדל״ן, שרה מיכל אדרי, עורכת דין ישראל, משפט משפחתי, משפט ישראלי, עורכת דין מומחית",
  authors: [{ name: "עורכת דין שרה מיכל אדרי" }],
  creator: "עורכת דין שרה מיכל אדרי",
  publisher: "עורכת דין שרה מיכל אדרי",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "עורכת דין שרה מיכל אדרי - משפט אזרחי ומעמד אישי",
    description: "שירות משפטי מקצועי בתחומי המשפט האזרחי, מעמד אישי, צוואות וייפוי כוח מתמשך. ניסיון של שנים בישראל.",
    url: siteUrl,
    siteName: "עורכת דין שרה מיכל אדרי",
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: "/sara.jpg",
        width: 1200,
        height: 630,
        alt: "עורכת דין שרה מיכל אדרי",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "עורכת דין שרה מיכל אדרי - משפט אזרחי ומעמד אישי",
    description: "שירות משפטי מקצועי בתחומי המשפט האזרחי, מעמד אישי, צוואות וייפוי כוח מתמשך.",
    images: [`${siteUrl}/sara.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: googleSiteVerification,
  },
  /** Favicon for SERP / tabs — Google recommends ≥48×48; source: /public/moz.png */
  icons: {
    icon: [
      { url: "/moz.png", type: "image/png", sizes: "48x48" },
      { url: "/moz.png", type: "image/png", sizes: "192x192" },
      { url: "/moz.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/moz.png", type: "image/png" }],
    apple: [{ url: "/moz.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* Explicit primary favicon — Google SERP uses site favicon (see Search Central favicon guidelines) */}
        <link rel="icon" href="/moz.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/moz.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "עורכת דין שרה מיכל אדרי",
                  inLanguage: "he-IL",
                  publisher: { "@id": `${siteUrl}/#organization` },
                },
                {
                  "@type": "LegalService",
                  "@id": `${siteUrl}/#organization`,
                  name: "עורכת דין שרה מיכל אדרי",
                  description:
                    "שירות משפטי מקצועי בתחומי המשפט האזרחי, מעמד אישי, צוואות, ייפוי כוח מתמשך ונדל״ן",
                  url: siteUrl,
                  image: `${siteUrl}/sara.jpg`,
                  logo: `${siteUrl}/moz.png`,
                  telephone: "+972-50-6466711",
                  email: "Sara_987654@walla.com",
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "IL",
                  },
                  areaServed: {
                    "@type": "Country",
                    name: "ישראל",
                  },
                  serviceType: [
                    "משפט אזרחי",
                    "מעמד אישי",
                    "צוואות",
                    "ייפוי כוח מתמשך",
                    "נדל״ן",
                  ],
                  founder: {
                    "@type": "Person",
                    name: "שרה מיכל אדרי",
                    jobTitle: "עורכת דין",
                  },
                  priceRange: "$$",
                  openingHours: "Mo-Fr 09:00-18:00",
                  sameAs: [],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}