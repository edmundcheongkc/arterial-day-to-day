"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ensureTeamMembership } from "@/lib/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (authError) {
      setError(authError.message);
      setIsPending(false);
      return;
    }

    if (data.session) {
      // Email confirmation is off for this project — signed in immediately.
      await ensureTeamMembership();
      router.push("/dashboard");
      router.refresh();
      return;
    }

    // Email confirmation required — no session yet.
    setCheckEmail(true);
    setIsPending(false);
  }

  if (checkEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm border border-neutral-200 rounded-lg p-6 bg-white shadow-sm text-center">
          <h1 className="text-xl font-semibold mb-2">Check your email</h1>
          <p className="text-sm text-neutral-600">
            We sent a confirmation link to <strong>{email}</strong>. Click it, then come back and{" "}
            <Link href="/login" className="underline hover:text-neutral-900">
              sign in
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border border-neutral-200 rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-xl font-semibold mb-1">Create an account</h1>
        <p className="text-sm text-neutral-500 mb-5">Arterial Day-to-Day</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="display_name">
              Name
            </label>
            <input
              id="display_name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="w-full px-3 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-700 disabled:opacity-50"
          >
            {isPending ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="text-xs text-neutral-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-neutral-900">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
