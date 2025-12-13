import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Header removed in favor of OS Sidebar
import { ChatProvider } from "@/components/chat/ChatProvider";
import { ImprovedDraggableChat } from "@/components/chat/ImprovedDraggableChat";
import { BearFunPopup } from "@/components/BearFunPopup";
import { Sidebar } from "@/components/os/Sidebar";
import { RoleProvider } from "@/lib/roleContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { MobileNav } from "@/components/mobile/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BearOS · Intelligent Automation Platform",
  description:
    "Unified operating system for Bear Robotics fleet management, knowledge, and communication.",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BearOS",
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
        <RoleProvider>
          <ChatProvider>
            {/* Desktop Layout - Only visible on >= 1024px */}
            <div className="hidden lg:flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto relative bg-[#020511]">
                {children}
              </main>
            </div>
            
            {/* Mobile Layout - Only visible on < 1024px */}
            <div className="lg:hidden flex flex-col h-screen overflow-hidden w-full max-w-full">
              <main className="flex-1 overflow-y-auto relative bg-[#020511] w-full" style={{ paddingBottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}>
                {children}
              </main>
              <MobileNav />
            </div>

            <ImprovedDraggableChat />
            <BearFunPopup />
          </ChatProvider>
        </RoleProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
