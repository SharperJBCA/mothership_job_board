"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const supabase = supabaseBrowser();

  return (
    <button
      className="underline"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/jobs";
      }}
    >
      Logout
    </button>
  );
}