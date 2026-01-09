import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luvis - Men's & Boys' Fashion",
  description: "Simple. Direct. Quality. Order via WhatsApp.",
};

import { MobileBottomNav } from "@/components/MobileBottomNav"; // Import
// ... existing imports ...

// ... existing code ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased pb-16 md:pb-0`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
