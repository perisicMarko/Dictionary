import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/app/globals.css";
import React from "react";
import getThemeColors from "@/server/theme/getThemeColors";
import { TColorsTheme } from "@/shared/types";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // fetch custom colors for school from users school
  const themeRes = (await getThemeColors());

  const theme = themeRes.data as TColorsTheme;

  return (
    <html
      lang="en"
      className="background"
      style={{
        ["--main-color" as string]: theme.main,
        ["--second-color" as string]: theme.second,
        ["--text-main-color" as string]: theme.text_main,
        ["--text-second-color" as string]: theme.text_second,
      }}
    >
      <body
        className={`${roboto.variable} antialiased center-vertically pb-20`}
      >
        {children}
      </body>
    </html>
  );
}
