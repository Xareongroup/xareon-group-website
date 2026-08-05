import { requireRole } from "@/lib/auth/requireRole";
export default async function FinancialsLayout({children}:{children:React.ReactNode}) { await requireRole(["owner","admin","manager"]); return children; }
