import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velocity Builders, LLC | The Title Rep Who Helps You Scale",
  description:
    "Velocity Builders is the marketing-ops engine for Northern Virginia agents, lenders, builders, and banks. Automations, IDX sites, and listing campaigns built for scale.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}>
        <NavBar />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(12,74,110,0.35),_transparent_55%)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
