import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow AI - Automate Your Workflows with AI",
  description: "AI-Powered Workflow Automation for Small Teams. Save time, boost productivity with smart automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-neutral-100 antialiased`}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
