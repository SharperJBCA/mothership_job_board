import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ClaimButton from "./ClaimButton";
import { requireGM } from "@/lib/gm";
import { readBriefForSlug } from "@/lib/briefs";

type Params = { slug: string };

type JobDetailPageProps = {
  params: Promise<Params>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;

  // Guard against empty dynamic route values before querying the database.
  if (!slug?.trim()) return notFound();

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return notFound();

  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  const gm = user ? await requireGM() : null;
  const isMine = !!user && data.claimed_by === user.id;
  const isAvailable = data.status === "available";
  const hasClaimedBy = !!data.claimed_by;
  const canClaim = isAvailable && !hasClaimedBy;

  let claimDisabledReason: string | null = null;
  if (!isMine && !canClaim) {
    if (!user) claimDisabledReason = "Sign in to claim this contract.";
    else if (!isAvailable) claimDisabledReason = `Status is ${data.status}, not available.`;
    else if (hasClaimedBy) claimDisabledReason = "This contract has already been claimed.";
  }

  const showDebug = process.env.NEXT_PUBLIC_DEBUG_JOB_DETAIL === "true";
  const brief = await readBriefForSlug(slug, data.brief);
  const claimedByName =
    data.claimed_by && isMine
      ? user?.user_metadata?.full_name || user?.email || "You"
      : data.claimed_by
        ? "Another operator"
        : null;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        <div className="text-xs opacity-80 flex gap-3">
          <span>Hazard {data.hazard}/5</span>
          <span>₡ {data.payout}</span>
          <span className="uppercase tracking-wide">{data.status}</span>
        </div>
      </div>

      {showDebug && (
        <p className="mt-2 text-xs font-mono opacity-70">
          debug user={user?.email ?? "none"} canClaim={String(canClaim)} isMine={String(isMine)}
        </p>
      )}

      <p className="mt-3 text-sm opacity-90">{data.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs opacity-80">
        <span className="rounded-full border px-2 py-1">{data.location}</span>
        <span className="rounded-full border px-2 py-1">{data.faction}</span>
        {data.tags?.map((t: string) => (
          <span key={t} className="rounded-full border px-2 py-1">
            {t}
          </span>
        ))}
      </div>

      <article className="mt-6 rounded-xl border p-4 whitespace-pre-wrap leading-relaxed">
        {brief}
      </article>

      <div className="mt-4">
        <ClaimButton
          jobId={data.id}
          canClaim={!!user && canClaim}
          isMine={isMine}
          isGM={!!gm?.ok}
          claimedByName={claimedByName}
          disabledReason={claimDisabledReason}
        />
        {!user && (
          <p className="mt-2 text-xs opacity-70">
            <a className="underline" href="/login">
              Sign in
            </a>{" "}
            to claim contracts.
          </p>
        )}
      </div>

      <p className="mt-6 text-xs opacity-70">
        Posted {new Date(data.posted_at).toLocaleString()}
      </p>
    </main>
  );
}
