"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en">
      <head>
        <title>Modern POS System</title>
        <meta name="description" content="Touch-friendly specialized POS System" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen w-full overflow-hidden bg-slate-50`}>
        <Providers>
          {/* Global Persistent Sidebar Navigation */}
          {!isAuthRoute && <Sidebar />}

          {/* Main Application Area */}
          <div className={`flex flex-col overflow-hidden ${isAuthRoute ? 'w-full flex-none' : 'flex-1'}`}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
