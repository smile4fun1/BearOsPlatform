import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { ImprovedDraggableChat } from "@/components/chat/ImprovedDraggableChat";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bear Universe · Intelligent Automation Ecosystem",
  description:
    "AI-powered operations platform for Bear Robotics featuring multi-agent orchestration, real-time telemetry, and intelligent task delegation across Seoul to Silicon Valley.",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bear Universe",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020511",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020511] text-white`}
      >
        <ChatProvider>
          <Header />
        {children}
          <ImprovedDraggableChat />
        </ChatProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
