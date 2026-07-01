import type { Metadata } from "next";
import { ThemeProvider } from "@/design-system/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design System Template",
  description: "Token validation viewer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
