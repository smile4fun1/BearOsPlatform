import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { ImprovedDraggableChat } from "@/components/chat/ImprovedDraggableChat";

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
      </body>
    </html>
  );
}
