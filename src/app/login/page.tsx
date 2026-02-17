"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-2 text-sm opacity-80">
        We’ll email you a magic link.
      </p>

      <form onSubmit={sendLink} className="mt-6 grid gap-3">
        <input
          className="border rounded-lg px-3 py-2 bg-transparent"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@shipmail.com"
        />
        <button className="border rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
          Send magic link
        </button>
      </form>

      {sent && (
        <p className="mt-4 text-sm">
          Link sent — check your email.
        </p>
      )}
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
    </main>
  );
}