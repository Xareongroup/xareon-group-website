"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const suggestions = ["TV Mounting", "Furniture Assembly", "Drywall Repair", "Painting", "Smart Home", "Networking", "Electrical", "Plumbing"];

export default function EmployeeSkillsEditor({ employeeId }: { employeeId: string }) {
  const supabase = createClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [skill, setSkill] = useState("");

  async function load() {
    const { data } = await supabase.from("employee_skills").select("skill").eq("employee_id", employeeId).order("skill");
    setSkills((data ?? []).map((item) => item.skill));
  }
  useEffect(() => { void load(); }, [employeeId]);
  async function add() {
    const value = skill.trim();
    if (!value || skills.includes(value)) return;
    const { error } = await supabase.from("employee_skills").insert({ employee_id: employeeId, skill: value });
    if (error) return window.alert(error.message);
    setSkill(""); await load();
  }
  async function remove(value: string) {
    const { error } = await supabase.from("employee_skills").delete().eq("employee_id", employeeId).eq("skill", value);
    if (error) return window.alert(error.message);
    await load();
  }
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Skills</h2><div className="mt-4 flex gap-2"><input value={skill} onChange={(event) => setSkill(event.target.value)} list="employee-skill-suggestions" placeholder="Add a skill" className="min-w-0 flex-1 rounded-lg border p-2.5"/><datalist id="employee-skill-suggestions">{suggestions.map((item) => <option key={item} value={item}/>)}</datalist><button type="button" onClick={add} className="rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white">Add</button></div><div className="mt-4 flex flex-wrap gap-2">{skills.length ? skills.map((item) => <button key={item} type="button" onClick={() => void remove(item)} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-red-50 hover:text-red-700">{item} ×</button>) : <p className="text-sm text-slate-500">No skills recorded.</p>}</div></section>;
}
