import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
type Job = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  payout: number;
  hazard: number;
  location: string;
  faction: string;
  tags: string[];
  status: string;
  posted_at: string;
};

export default async function JobsPage() {
  const supabase = await supabaseServer();
  const debugAdminLinkEnabled = process.env.NEXT_PUBLIC_DEBUG_ADMIN_LINK === "true";
  
  const { data, error } = await supabase
    .from("jobs")
    .select("id,slug,title,summary,payout,hazard,location,faction,tags,status,posted_at")
    .order("posted_at", { ascending: false });
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  const showDebugAdminLink = Boolean(user || debugAdminLinkEnabled);
  
  if (error) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold">Contracts</h1>
        <p className="mt-4 text-sm opacity-80">
          Couldn’t load jobs: {error.message}
        </p>
      </main>
    );
  }

  const jobs = (data ?? []) as Job[];

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold">Contracts</h1>
        <span className="text-xs opacity-70">
          {jobs.length} listing{jobs.length === 1 ? "" : "s"}
        </span>
        <div className="text-xs opacity-70">
          {user ? `Signed in: ${user.email}` : <a className="underline" href="/login">Sign in</a>}
        </div>
      </header>

      <div className="mt-6 grid gap-4">
        {jobs.map((j) => (
          <Link
            key={j.id}
            href={`/jobs/${j.slug}`}
            className="rounded-xl border p-4 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-medium">{j.title}</h2>
              <div className="text-xs opacity-80 flex gap-3">
                <span>Hazard {j.hazard}/5</span>
                <span>₡ {j.payout}</span>
                <span className="uppercase tracking-wide">{j.status}</span>
              </div>
            </div>

            <p className="mt-2 text-sm opacity-90">{j.summary}</p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs opacity-80">
              <span className="rounded-full border px-2 py-1">{j.location}</span>
              <span className="rounded-full border px-2 py-1">{j.faction}</span>
              {j.tags?.slice(0, 6).map((t) => (
                <span key={t} className="rounded-full border px-2 py-1">
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {showDebugAdminLink && (
        <footer className="mt-8 border-t pt-4 text-xs opacity-80">
          <Link className="underline" href="/admin/jobs">
            Debug: Open GM jobs admin
          </Link>
        </footer>
      )}
    </main>
  );
}
