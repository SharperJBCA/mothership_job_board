import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AuthStatus() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="text-xs opacity-80 flex items-center gap-3">
      {user ? (
        <>
          <span>{user.email}</span>
          <LogoutButton />
        </>
      ) : (
        <Link className="underline" href="/login">
          Sign in
        </Link>
      )}
    </div>
  );
}