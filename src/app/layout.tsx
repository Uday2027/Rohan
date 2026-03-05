import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Magic Daily Planner - Achieve Your Goals",
  description: "সময়কে নিয়ন্ত্রণ করুন, সফলতাকে নিজের করুন। Magic Daily Planner আপনাকে প্রতিদিন ফোকাসড, সংগঠিত ও প্রোডাক্টিভ থাকতে সাহায্য করবে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth dark">
      <body
        className={`${outfit.variable} antialiased bg-background text-foreground selection:bg-blue-500/30`}
      >
        {children}
      </body>
    </html>
  );
}
