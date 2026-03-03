import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modern POS System",
  description: "Touch-friendly specialized POS System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen w-full overflow-hidden bg-slate-50`}>
        {/* Global Persistent Sidebar Navigation */}
        <Sidebar />

        {/* Main Application Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
