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
import { Toaster } from 'react-hot-toast';

import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Last Minute Life Saver",
  description: "Mathematically prevent procrastination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <body className="flex flex-col text-foreground bg-background min-h-screen" suppressHydrationWarning>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0 relative z-10">
              {children}
            </main>
            <AIChat />
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
          </SmoothScroll>
        </body>
      </html>
    </ClerkProvider>
  );
}
