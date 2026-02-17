"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function ClaimButton({
  jobId,
  canClaim,
  isMine,
}: {
  jobId: string;
  canClaim: boolean;
  isMine: boolean;
}) {
  const supabase = supabaseBrowser();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function claim() {
    setLoading(true);
    setErr(null);
    const { error } = await supabase
      .from("jobs")
      .update({ status: "claimed", claimed_by: (await supabase.auth.getUser()).data.user?.id ?? null, claimed_at: new Date().toISOString() })
      .eq("id", jobId);

    setLoading(false);
    if (error) setErr(error.message);
    else window.location.reload();
  }

  async function unclaim() {
    setLoading(true);
    setErr(null);
    const { error } = await supabase
      .from("jobs")
      .update({ status: "available", claimed_by: null, claimed_at: null })
      .eq("id", jobId);

    setLoading(false);
    if (error) setErr(error.message);
    else window.location.reload();
  }

  return (
    <div className="mt-6 grid gap-2">
      {isMine ? (
        <button
          disabled={loading}
          onClick={unclaim}
          className="border rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
        >
          Unclaim
        </button>
      ) : (
        <button
          disabled={loading || !canClaim}
          onClick={claim}
          className="border rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
        >
          Claim
        </button>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {!canClaim && !isMine && (
        <p className="text-xs opacity-70">
          This contract is not available to claim.
        </p>
      )}
    </div>
  );
}