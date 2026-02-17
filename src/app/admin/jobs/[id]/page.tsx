import { supabaseServer } from "@/lib/supabase/server";
import { upsertJob, deleteJob } from "../actions";
import { notFound } from "next/navigation";

type Params = { id: string };

type EditJobPageProps = {
  params: Promise<Params>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;

  // Guard against empty dynamic route values before querying the database.
  if (!id?.trim()) return notFound();

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return notFound();

  return (
    <div className="grid gap-6 max-w-2xl">
      <form action={upsertJob} className="grid gap-3">
        <h2 className="text-lg font-medium">Edit job</h2>
        <input type="hidden" name="id" value={data.id} />

        <input name="slug" className="border rounded-lg px-3 py-2" defaultValue={data.slug} required />
        <input name="title" className="border rounded-lg px-3 py-2" defaultValue={data.title} required />
        <input name="summary" className="border rounded-lg px-3 py-2" defaultValue={data.summary} required />
        <textarea name="brief" className="border rounded-lg px-3 py-2 min-h-[200px]" defaultValue={data.brief} required />

        <div className="grid grid-cols-2 gap-3">
          <input name="payout" type="number" className="border rounded-lg px-3 py-2" defaultValue={data.payout} />
          <input name="hazard" type="number" className="border rounded-lg px-3 py-2" defaultValue={data.hazard} min={1} max={5} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="location" className="border rounded-lg px-3 py-2" defaultValue={data.location} />
          <input name="faction" className="border rounded-lg px-3 py-2" defaultValue={data.faction} />
        </div>

        <input
          name="tags"
          className="border rounded-lg px-3 py-2"
          defaultValue={(data.tags ?? []).join(", ")}
        />

        <select name="status" className="border rounded-lg px-3 py-2" defaultValue={data.status}>
          <option value="available">available</option>
          <option value="claimed">claimed</option>
          <option value="completed">completed</option>
          <option value="expired">expired</option>
        </select>

        <button className="border rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
          Save
        </button>
      </form>

      <form action={deleteJob}>
        <input type="hidden" name="id" value={data.id} />
        <button className="border rounded-lg px-3 py-2 text-red-600 hover:bg-red-500/10">
          Delete job
        </button>
      </form>
    </div>
  );
}
