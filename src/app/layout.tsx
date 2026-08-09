import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SuppressErrors } from "@/components/suppress-errors";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Portfolio",
  description: "Your personal music collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f5f0e8]">
        <SuppressErrors />
        {children}
      </body>
    </html>
  );
}
