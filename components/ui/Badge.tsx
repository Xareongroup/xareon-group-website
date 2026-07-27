import * as React from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  const variants = {
    default:
      "bg-slate-100 text-slate-800",

    secondary:
      "bg-slate-200 text-slate-700",

    success:
      "bg-green-100 text-green-800",

    warning:
      "bg-yellow-100 text-yellow-800",

    danger:
      "bg-red-100 text-red-800",

    info:
      "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        whitespace-nowrap
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}