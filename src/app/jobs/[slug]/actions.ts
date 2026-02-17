"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { requireGM } from "@/lib/gm";

export async function claimJob(jobId: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in to claim a contract." };
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "claimed",
      claimed_by: user.id,
      claimed_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .eq("status", "available")
    .is("claimed_by", null)
    .select("id");

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return {
      ok: false,
      error: "This contract was already claimed or is no longer available.",
    };
  }

  return { ok: true };
}

export async function unclaimJob(jobId: string) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in to unclaim a contract." };
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "available",
      claimed_by: null,
      claimed_at: null,
    })
    .eq("id", jobId)
    .eq("claimed_by", user.id)
    .eq("status", "claimed")
    .select("id");

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return { ok: false, error: "You can only unclaim contracts you claimed." };
  }

  return { ok: true };
}

export async function adminUnclaimJob(jobId: string) {
  const gm = await requireGM();
  if (!gm.ok) {
    return { ok: false, error: "Only GMs can remove a claim." };
  }

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "available",
      claimed_by: null,
      claimed_at: null,
    })
    .eq("id", jobId)
    .select("id");

  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) {
    return { ok: false, error: "Contract not found." };
  }

  return { ok: true };
}
