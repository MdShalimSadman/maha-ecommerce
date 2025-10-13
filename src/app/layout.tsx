import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/layout/Navbar";
import SecondaryNav from "./component/layout/SecondaryNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAHA- Your first step towards modesty",
  description:
    "Welcome to the home of modest gowns, hijabs and abayas. We deliver our products anywhere in Bangladesh. Pre-order now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        <SecondaryNav/>
        {children}
      </body>
    </html>
  );
}
