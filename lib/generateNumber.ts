import { SupabaseClient } from "@supabase/supabase-js";

export async function generateNumber(
  supabase: SupabaseClient,
  table: string,
  column: string,
  prefix: string
): Promise<string> {
  const { data, error } = await supabase
    .from(table)
    .select(column)
    .order(column, { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  let next = 1;

  const current = (data?.[0] as any)?.[column];

  if (typeof current === "string") {
    const match = current.match(/(\d+)$/);

    if (match) {
      next = Number(match[1]) + 1;
    }
  }

  return `${prefix}-${String(next).padStart(6, "0")}`;
}