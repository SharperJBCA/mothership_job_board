import { supabaseServer } from "@/lib/supabase/server";

export async function requireGM() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return { ok: false as const, reason: "no-user" as const };

  const { data: gmRow } = await supabase
    .from("gm_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  return gmRow ? { ok: true as const, user: data.user } : { ok: false as const, reason: "not-gm" as const };
}