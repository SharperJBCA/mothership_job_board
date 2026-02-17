import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ClaimButton from "./ClaimButton";

// inside component after loading `data`…
const supabase = await supabaseServer();
const { data: auth } = await supabase.auth.getUser();
const user = auth.user;

const isMine = user && data.claimed_by === user.id;
const canClaim = data.status === "available" && !data.claimed_by;

{/* near the bottom */}
<ClaimButton jobId={data.id} canClaim={!!user && canClaim} isMine={!!isMine} />

{!user && (
  <p className="mt-2 text-xs opacity-70">
    <a className="underline" href="/login">Sign in</a> to claim contracts.
  </p>
)}

type Params = { slug: string };

export default async function JobDetailPage({ params }: { params: Params }) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return notFound();

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
        {data.brief}
      </article>

      <p className="mt-6 text-xs opacity-70">
        Posted {new Date(data.posted_at).toLocaleString()}
      </p>
    </main>
  );
}