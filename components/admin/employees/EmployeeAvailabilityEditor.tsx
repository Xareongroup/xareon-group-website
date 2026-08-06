"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
type Availability = { weekday: number; is_available: boolean; start_time: string; end_time: string };
const defaults = weekdays.map((_, weekday) => ({ weekday, is_available: weekday > 0 && weekday < 6, start_time: "08:00", end_time: "17:00" }));

export default function EmployeeAvailabilityEditor({ employeeId }: { employeeId: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Availability[]>(defaults);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("employee_availability").select("weekday,is_available,start_time,end_time").eq("employee_id", employeeId);
      if (!data?.length) return;
      setRows(defaults.map((item) => {
        const saved = data.find((row) => row.weekday === item.weekday);
        return saved ? { weekday: item.weekday, is_available: saved.is_available, start_time: saved.start_time?.slice(0, 5) ?? item.start_time, end_time: saved.end_time?.slice(0, 5) ?? item.end_time } : item;
      }));
    }
    void load();
  }, [employeeId, supabase]);
  function update(weekday: number, patch: Partial<Availability>) { setRows((previous) => previous.map((row) => row.weekday === weekday ? { ...row, ...patch } : row)); }
  async function save() { setSaving(true); const payload = rows.map((row) => ({ employee_id: employeeId, weekday: row.weekday, is_available: row.is_available, start_time: row.is_available ? row.start_time : null, end_time: row.is_available ? row.end_time : null })); const { error } = await supabase.from("employee_availability").upsert(payload, { onConflict: "employee_id,weekday" }); setSaving(false); if (error) window.alert(error.message); }
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Weekly Availability</h2><button type="button" onClick={save} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save Availability"}</button></div><div className="mt-4 space-y-3">{rows.map((row) => <div key={row.weekday} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 text-sm"><span className="font-medium">{weekdays[row.weekday]}</span><label className="flex items-center gap-2"><input type="checkbox" checked={row.is_available} onChange={(event) => update(row.weekday, { is_available: event.target.checked })}/> Available</label><input type="time" value={row.start_time} disabled={!row.is_available} onChange={(event) => update(row.weekday, { start_time: event.target.value })} className="rounded border p-2 disabled:bg-slate-100"/><input type="time" value={row.end_time} disabled={!row.is_available} onChange={(event) => update(row.weekday, { end_time: event.target.value })} className="rounded border p-2 disabled:bg-slate-100"/></div>)}</div></section>;
}
