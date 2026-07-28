"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import NotificationPanel from "./NotificationPanel";

interface Props {
  unread?: number;
}

export default function NotificationBell({
  unread = 0,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl p-2 transition hover:bg-slate-100"
      >
        <Bell className="h-6 w-6 text-slate-700" />

        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && <NotificationPanel />}
    </div>
  );
}