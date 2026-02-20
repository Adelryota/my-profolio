import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio | Full Stack Developer",
  description:
    "Modern animated portfolio — Full Stack Developer showcasing projects, demos, and skills.",
  keywords: ["portfolio", "full stack developer", "Next.js", "React", "TypeScript"],
  openGraph: {
    title: "Portfolio | Full Stack Developer",
    description: "Modern animated portfolio with interactive 3D hero",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body id="top">{children}</body>
    </html>
  );
}
