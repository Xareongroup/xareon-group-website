import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type PlatformRole = "owner" | "admin" | "manager" | "dispatcher" | "technician" | "accounting" | "sales" | "employee" | "contractor" | "customer";

/** Route handlers must authorize independently of page/layout guards. */
export async function requireApiRole(roles: PlatformRole[]): Promise<{ user: User; role: PlatformRole } | { response: NextResponse }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  // user_roles is introduced by the additive RBAC migration. Keep this isolated
  // until types are regenerated after that migration is applied to staging.
  const { data, error } = await (supabase as any).from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (error || !data || !roles.includes(data.role as PlatformRole)) {
    return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, role: data.role as PlatformRole };
}
