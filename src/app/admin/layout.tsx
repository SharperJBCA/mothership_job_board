import { redirect } from "next/navigation";
import Link from "next/link";
import { requireGM } from "@/lib/gm";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const gm = await requireGM();
  if (!gm.ok) {
    if (gm.reason === "no-user") redirect("/login");
    redirect("/jobs?error=not-authorized");
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">GM Console</h1>
        <nav className="text-sm opacity-80 flex gap-4">
          <Link className="underline" href="/admin/jobs">Jobs</Link>
          <Link className="underline" href="/jobs">Public Board</Link>
        </nav>
      </header>

      <div className="mt-6">{children}</div>
    </main>
  );
}
