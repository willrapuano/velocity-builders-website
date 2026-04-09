import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = "https://velocity-builders.com";
const title = "Velocity Builders | Websites, SEO & Marketing for Real Estate Agents, Lenders & Builders";
const description =
  "Velocity Builders builds high-converting websites, local SEO strategies, and automated marketing systems that help real estate agents, lenders, builders, and financial institutions generate leads, close more deals, and dominate their market.";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-800`}>
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
              email: "hello@velocity-builders.com",
              telephone: "(703) 859-1467",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Vienna",
                addressRegion: "VA",
                addressCountry: "US",
              },
              areaServed: "United States",
            }),
          }}
        />
        <NavBar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
