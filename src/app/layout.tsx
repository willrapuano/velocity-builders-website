import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const siteUrl = "https://velocitybuilders.io";
const title = "Velocity Builders | NoVA Growth Systems";
const description =
  "NoVA agents and lenders: get faster lead response, better follow-up, and more closings with websites and CRM systems built for Fairfax, Loudoun, and Prince William.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Velocity Builders",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Velocity Builders, LLC",
              url: siteUrl,
              description,
              email: "hello@velocitybuilders.io",
              telephone: "(703) 555-0145",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Vienna",
                addressRegion: "VA",
                addressCountry: "US",
              },
              areaServed: "Northern Virginia",
            }),
          }}
        />
        <NavBar />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(12,74,110,0.35),_transparent_55%)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
