import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitLog - Workout Library",
  description: "Train with intent. Log every set.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col justify-between`}>
        <div>
          <Navbar />
          <main>{children}</main>
        </div>

        {/* Footer */}
        <footer className="bg-black border-t border-zinc-900 py-8 px-6 mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Brand Logo Image + FITLOG */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image 
                src="/logo.png" 
                alt="FitLog Logo" 
                width={28} 
                height={28} 
                className="object-contain"
              />
              <span className="text-white font-extrabold tracking-wider text-base">FITLOG</span>
            </Link>

            {/* Right: Copyright line */}
            <p className="text-zinc-500 text-xs text-center md:text-right">
              © 2026 FitLog — Workout Library. Train hard, log honest.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}