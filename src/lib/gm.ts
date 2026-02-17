import { supabaseServer } from "@/lib/supabase/server";

function getDebugBypassEmails() {
  return (process.env.ALLOW_DEBUG_GM_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireGM() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return { ok: false as const, reason: "no-user" as const };

  const debugBypassEmails = getDebugBypassEmails();
  const debugAdminMode = process.env.NEXT_PUBLIC_DEBUG_ADMIN_LINK === "true";
  const userEmail = data.user.email?.toLowerCase();

  if (debugAdminMode) {
    return { ok: true as const, user: data.user, bypass: true as const };
  }

  if (userEmail && debugBypassEmails.includes(userEmail)) {
    return { ok: true as const, user: data.user, bypass: true as const };
  }

  const { data: gmRow } = await supabase
    .from("gm_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  return gmRow ? { ok: true as const, user: data.user } : { ok: false as const, reason: "not-gm" as const };
}
