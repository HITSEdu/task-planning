import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/app/_components/header/header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Task Planning",
    default: "Task Planning",
  },
  description: "Планирование задач в командах",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="max-w-screen h-full flex flex-col">{children}</main>
          <Toaster richColors={true} closeButton={true} position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
