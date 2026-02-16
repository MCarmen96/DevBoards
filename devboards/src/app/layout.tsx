import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeProvider as AppThemeProvider } from "@/context/ThemeContext";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevBoards - Colecciona código creativo",
  description: "Aplicación tipo Pinterest para desarrolladores web. Colecciona y comparte UI, CSS, HTML, JavaScript y TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} d-flex flex-column min-vh-100`}>
        <AuthProvider>
          <ThemeProvider>
            <AppThemeProvider>
              <Header />
              {children}
            </AppThemeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
