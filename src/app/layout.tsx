import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import { Toaster } from "../../components/ui/toaster";
import SessionWatcher from "./components/SessionWatcher"; 

export const metadata: Metadata = {
  title: "My CRM",
  description: "Bouakaz",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <SessionWatcher>
            {children}
            <Toaster />
          </SessionWatcher>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
