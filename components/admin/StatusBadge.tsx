interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const colors: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-700",

    Sent: "bg-blue-100 text-blue-700",

    Viewed: "bg-purple-100 text-purple-700",

    Approved: "bg-green-100 text-green-700",

    Rejected: "bg-red-100 text-red-700",

    Expired: "bg-orange-100 text-orange-700",

    Scheduled: "bg-blue-100 text-blue-700",

    "In Progress":
      "bg-amber-100 text-amber-700",

    Completed:
      "bg-green-100 text-green-700",

    Cancelled:
      "bg-red-100 text-red-700",

    Paid:
      "bg-green-100 text-green-700",

    Signed:
      "bg-green-100 text-green-700",

    Pending:
      "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
        colors[status] ??
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}