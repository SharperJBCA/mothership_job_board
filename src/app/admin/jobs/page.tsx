import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export default async function AdminJobsPage() {
  const supabase = await supabaseServer();

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, slug, title, status, posted_at")
    .order("posted_at", { ascending: false });

  if (error) {
    return <p className="text-sm">Error: {error.message}</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Jobs</h2>
        <Link className="underline" href="/admin/jobs/new">New job</Link>
      </div>

      <div className="grid gap-2">
        {(jobs ?? []).map((j) => (
          <div key={j.id} className="border rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{j.title}</div>
              <div className="text-xs opacity-70">{j.slug} • {j.status}</div>
            </div>
            <Link className="underline text-sm" href={`/admin/jobs/${j.id}`}>Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}