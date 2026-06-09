import type { Metadata } from "next";
import { Geist, Jura } from "next/font/google";
import "./globals.css";
import { UIRootProvider } from "@/components/layout/ui-root-provider";
import { ThemeProvider } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

const jura = Jura({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vyoma - Celestial Navigation",
  description: "Advanced celestial navigation and visualization tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        "font-mono",
        jura.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UIRootProvider>{children}</UIRootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
