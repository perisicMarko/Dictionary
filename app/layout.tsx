import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dictionary",
  description: "",
  icons: {
    icon: "/", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bgThemeColor background backgroundStyle">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-center items-center`}>
        {children}
      </body>
    </html>
  );
}
