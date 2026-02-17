import { upsertJob } from "../actions";

export default function NewJobPage() {
  return (
    <form action={upsertJob} className="grid gap-3 max-w-2xl">
      <h2 className="text-lg font-medium">New job</h2>

      <input name="slug" className="border rounded-lg px-3 py-2" placeholder="slug-like-this" required />
      <input name="title" className="border rounded-lg px-3 py-2" placeholder="Title" required />
      <input name="summary" className="border rounded-lg px-3 py-2" placeholder="Short summary" required />
      <textarea name="brief" className="border rounded-lg px-3 py-2 min-h-[200px]" placeholder="Optional inline brief fallback" />
      <p className="text-xs opacity-70">
        Preferred: create <code>briefs/&lt;slug&gt;.md</code>. The job detail page will load that markdown file first.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <input name="payout" type="number" className="border rounded-lg px-3 py-2" placeholder="Payout" defaultValue={0} />
        <input name="hazard" type="number" className="border rounded-lg px-3 py-2" placeholder="Hazard 1-5" defaultValue={2} min={1} max={5} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input name="location" className="border rounded-lg px-3 py-2" placeholder="Location" defaultValue="Unknown" />
        <input name="faction" className="border rounded-lg px-3 py-2" placeholder="Faction" defaultValue="Independent" />
      </div>

      <input name="tags" className="border rounded-lg px-3 py-2" placeholder="tags, comma, separated" />
      <select name="status" className="border rounded-lg px-3 py-2" defaultValue="available">
        <option value="available">available</option>
        <option value="claimed">claimed</option>
        <option value="completed">completed</option>
        <option value="expired">expired</option>
      </select>

      <button className="border rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5">
        Save
      </button>
    </form>
  );
}
