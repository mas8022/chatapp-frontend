import "./globals.css";
import RefreshTokenProvider from "@/providers/RefreshTokenProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-white text-zinc-900 antialiased transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50">
        <QueryProvider>
          <RefreshTokenProvider>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </RefreshTokenProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
