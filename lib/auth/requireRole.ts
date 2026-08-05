import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export type PlatformRole = "owner"|"admin"|"manager"|"employee"|"contractor"|"customer";
export async function requireRole(roles: PlatformRole[]) { const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) redirect("/admin/login"); const {data}=await supabase.from("user_roles").select("role").eq("user_id",user.id).single(); if(!data || !roles.includes(data.role as PlatformRole)) redirect("/admin/dashboard"); return { user, role:data.role as PlatformRole }; }
