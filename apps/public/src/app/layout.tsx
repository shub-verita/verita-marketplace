import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Verita Marketplace Jobs",
  description: "Join our global network of AI training specialists. Remote contract opportunities in data annotation, quality assurance, and AI training.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white min-h-screen flex flex-col`}>
        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Logo className="h-6" />

              <div className="flex items-center gap-6 text-sm text-slate-600">
                <Link href="/terms" className="hover:text-slate-900 transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                  Privacy
                </Link>
              </div>

              <p className="text-sm text-slate-500">
                © 2025 Verita Marketplace
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
