"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AppointmentForm() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    appointment_date: "",
    start_time: "",
    end_time: "",
    technician: "",
    location: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("appointments")
      .insert({
        ...form,
        status: "Scheduled",
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Appointment created successfully!");

    setForm({
      title: "",
      description: "",
      appointment_date: "",
      start_time: "",
      end_time: "",
      technician: "",
      location: "",
    });
  }

  function update(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold">
        New Appointment
      </h2>

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Appointment Title"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        required
      />

      <textarea
        className="w-full rounded-xl border p-3"
        rows={3}
        placeholder="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <input
        type="date"
        className="w-full rounded-xl border p-3"
        value={form.appointment_date}
        onChange={(e) => update("appointment_date", e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="time"
          className="rounded-xl border p-3"
          value={form.start_time}
          onChange={(e) => update("start_time", e.target.value)}
          required
        />

        <input
          type="time"
          className="rounded-xl border p-3"
          value={form.end_time}
          onChange={(e) => update("end_time", e.target.value)}
        />
      </div>

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Technician"
        value={form.technician}
        onChange={(e) => update("technician", e.target.value)}
      />

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Job Location"
        value={form.location}
        onChange={(e) => update("location", e.target.value)}
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Appointment"}
      </button>
    </form>
  );
}