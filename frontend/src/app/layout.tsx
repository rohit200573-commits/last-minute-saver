import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import AIChat from '@/components/AIChat';

export const metadata: Metadata = {
  title: "Last Minute Life Saver",
  description: "AI Productivity Copilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex flex-col text-white min-h-screen" style={{ backgroundColor: '#050505' }}>
        <SmoothScroll>
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0 relative z-10">
            {children}
          </main>
          <AIChat />
        </SmoothScroll>
      </body>
    </html>
  );
}
