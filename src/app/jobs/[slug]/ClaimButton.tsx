"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUnclaimJob, claimJob, unclaimJob } from "./actions";

export default function ClaimButton({
  jobId,
  canClaim,
  isMine,
  isGM,
  claimedByName,
  disabledReason,
}: {
  jobId: string;
  canClaim: boolean;
  isMine: boolean;
  isGM: boolean;
  claimedByName?: string | null;
  disabledReason?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function claim() {
    setLoading(true);
    setErr(null);

    const result = await claimJob(jobId);

    setLoading(false);
    if (!result.ok) setErr(result.error);
    else router.refresh();
  }

  async function adminUnclaim() {
    setLoading(true);
    setErr(null);

    const result = await adminUnclaimJob(jobId);

    setLoading(false);
    if (!result.ok) setErr(result.error);
    else router.refresh();
  }

  async function unclaim() {
    setLoading(true);
    setErr(null);

    const result = await unclaimJob(jobId);

    setLoading(false);
    if (!result.ok) setErr(result.error);
    else router.refresh();
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
        <p className="text-xs opacity-70">{disabledReason ?? "This contract is not available to claim."}</p>
      )}
      {claimedByName && <p className="text-xs opacity-80">Claimed by: {claimedByName}</p>}
      {isGM && !isMine && !canClaim && (
        <button
          disabled={loading}
          onClick={adminUnclaim}
          className="justify-self-start border rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
        >
          GM: Remove claimant
        </button>
      )}
    </div>
  );
}
