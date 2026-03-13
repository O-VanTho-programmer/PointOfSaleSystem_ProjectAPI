import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'text-sm font-semibold text-slate-800',
              duration: 3000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
