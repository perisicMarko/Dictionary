import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import React from "react";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dictionary",
  description: "",
  icons: {
    icon: "/favi.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="background">
      <body
        className={`${roboto.variable} antialiased flex flex-col justify-center items-center mb-48`}
      >
        {children}
      </body>
    </html>
  );
}
