import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth";
import { SignOutButton } from "@/components/SignOutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arterial Day-to-Day",
  description: "Shared team operations tracker",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="border-b border-neutral-200 px-6 md:px-10 py-3 flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <Link href="/dashboard" className="font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/team" className="font-medium hover:underline">
              Team
            </Link>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-neutral-500">
                {user.displayName} <span className="text-neutral-400">· {user.role}</span>
              </span>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="font-medium hover:underline">
                Sign in
              </Link>
              <Link href="/signup" className="font-medium hover:underline">
                Sign up
              </Link>
            </div>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}
