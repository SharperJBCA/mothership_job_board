"use server";

import { redirect } from "next/navigation";
import { requireGM } from "@/lib/gm";
import { supabaseServer } from "@/lib/supabase/server";

export async function upsertJob(formData: FormData) {
  const gm = await requireGM();
  if (!gm.ok) throw new Error("Not authorized");

  const supabase = await supabaseServer();

  const id = (formData.get("id") as string) || null;

  const payload = {
    id: id ?? undefined,
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    brief: String(formData.get("brief") ?? "").trim(),
    payout: Number(formData.get("payout") ?? 0),
    hazard: Number(formData.get("hazard") ?? 2),
    location: String(formData.get("location") ?? "Unknown").trim(),
    faction: String(formData.get("faction") ?? "Independent").trim(),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status: String(formData.get("status") ?? "available"),
  };

  const { error } = await supabase.from("jobs").upsert(payload);
  if (error) throw new Error(error.message);

  redirect("/admin/jobs");
}

export async function deleteJob(formData: FormData) {
  const gm = await requireGM();
  if (!gm.ok) throw new Error("Not authorized");

  const supabase = await supabaseServer();
  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);

  redirect("/admin/jobs");
}