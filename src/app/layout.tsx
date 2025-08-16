import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LaunchPrint",
  description: "New to Marketing? You're Exactly Who I Built This For",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/public/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/src/app/favicon.ico" type="image/x-icon" />
        {/* Open Graph Tags */}
        <meta property="og:title" content="LaunchPrint - Actionable Marketing for Indie Founders" />
        <meta property="og:description" content="Get a step-by-step marketing strategy, launch checklist, and community outreach plan. Built for beginners and indie hackers." />
        <meta property="og:image" content="https://launchprint.deplo.yt/og-image.png" />
        <meta property="og:url" content="https://launchprint.deplo.yt/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="LaunchPrint" />
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="https://i.postimg.cc/rwjVRrJn/Twitter-LG.png" />
        <meta name="twitter:title" content="LaunchPrint - Actionable Marketing for Indie Founders" />
        <meta name="twitter:description" content="Get a step-by-step marketing strategy, launch checklist, and community outreach plan. Built for beginners and indie hackers." />
        <meta name="twitter:image" content="https://i.postimg.cc/7ZwPLVgJ/Twitter-SM.png" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="fafce664-362a-4c80-8f7c-a8c2fbe30abd"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen border-8 border-[var(--primary)]`}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
