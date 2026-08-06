import "server-only";

import { adminSupabase } from "@/lib/supabase/admin";

export async function authenticatePortalToken(token: string) {
  if (!token || token.length < 16) return null;
  const { data, error } = await adminSupabase
    .from("customers")
    .select("id, first_name, last_name, email, phone, address, portal_token, portal_created_at")
    .eq("portal_token", token)
    .maybeSingle();
  if (error) console.error("Portal token lookup failed", error);
  return data ?? null;
}
