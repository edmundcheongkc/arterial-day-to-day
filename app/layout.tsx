import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arterial Day-to-Day",
  description: "Shared team operations tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="border-b border-neutral-200 px-6 md:px-10 py-3 flex gap-4 text-sm">
          <Link href="/dashboard" className="font-medium hover:underline">
            Dashboard
          </Link>
          <Link href="/team" className="font-medium hover:underline">
            Team
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
