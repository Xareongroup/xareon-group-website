"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import type {
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";

import { createClient } from "@/lib/supabase/client";

interface CalendarJob {
  id: string;
  job_number: string;
  title: string;
  status: string;
  scheduled_date: string | null;
  start_time: string | null;
  end_time: string | null;
}

export default function DispatchCalendar() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "#16a34a";

      case "In Progress":
        return "#f59e0b";

      case "Cancelled":
        return "#dc2626";

      default:
        return "#2563eb";
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return null;

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select(`
          id,
          job_number,
          title,
          status,
          scheduled_date,
          start_time,
          end_time
        `)
        .not("scheduled_date", "is", null)
        .order("scheduled_date")
        .order("start_time");

      if (error) throw error;

      const jobs = (data ?? []) as CalendarJob[];

      const calendarEvents: EventInput[] = jobs.map((job) => ({
        id: job.id,

        title: `${job.job_number}\n${job.title}`,

        start: job.start_time
          ? `${job.scheduled_date}T${job.start_time}`
          : `${job.scheduled_date}T08:00:00`,

        end: job.end_time
          ? `${job.scheduled_date}T${job.end_time}`
          : undefined,

        backgroundColor: getColor(job.status),

        borderColor: getColor(job.status),

        textColor: "#ffffff",

        display: "block",

        extendedProps: {
          status: job.status,
          jobNumber: job.job_number,
          jobTitle: job.title,
        },
      }));

      setEvents(calendarEvents);
    } catch (err) {
      console.error("Unable to load calendar.", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);
    async function updateJob(
    jobId: string,
    start: Date | null,
    end: Date | null
  ) {
    if (!start) return false;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("jobs")
        .update({
          scheduled_date: formatDate(start),
          start_time: formatTime(start),
          end_time: formatTime(end),
        })
        .eq("id", jobId);

      if (error) throw error;

      return true;
    } catch (err) {
      console.error("Unable to update job.", err);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleEventDrop(info: EventDropArg) {
    const success = await updateJob(
      String(info.event.id),
      info.event.start,
      info.event.end
    );

    if (!success) {
      info.revert();
      return;
    }

    await loadJobs();
  }

  async function handleEventResize(info: any) {
    const success = await updateJob(
      String(info.event.id),
      info.event.start,
      info.event.end
    );

    if (!success) {
      info.revert();
      return;
    }

    await loadJobs();
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex items-center justify-center py-20">
          <span className="text-slate-500">
            Loading dispatch calendar...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        height="750px"

        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}

        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}

        editable={!saving}
        selectable={true}
        weekends={true}

        dayMaxEvents={3}
        nowIndicator={true}
        navLinks={true}
        stickyHeaderDates={true}

        events={events}

        eventDrop={handleEventDrop}

        eventResize={handleEventResize}
                eventClick={(info: EventClickArg) => {
          router.push(`/admin/jobs/${info.event.id}`);
        }}

        eventDisplay="block"

        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}

        eventDidMount={(info) => {
          const el = info.el;

          el.style.cursor = saving ? "wait" : "pointer";
          el.style.borderRadius = "8px";
          el.style.fontWeight = "600";
          el.style.transition = "all 0.15s ease";
          el.style.boxShadow =
            "0 1px 3px rgba(0,0,0,0.12)";
        }}

        eventMouseEnter={(info) => {
          info.el.style.transform = "scale(1.02)";
          info.el.style.boxShadow =
            "0 6px 14px rgba(0,0,0,0.18)";
        }}

        eventMouseLeave={(info) => {
          info.el.style.transform = "scale(1)";
          info.el.style.boxShadow =
            "0 1px 3px rgba(0,0,0,0.12)";
        }}
      />
    </div>
  );
}