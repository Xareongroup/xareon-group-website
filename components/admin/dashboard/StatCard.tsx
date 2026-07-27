import Link from "next/link";
import Card from "@/components/ui/Card";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;

  change?: string;
  changeType?: "positive" | "negative" | "neutral";

  href?: string;

  color?:
    | "blue"
    | "green"
    | "orange"
    | "purple"
    | "red";
}

const colors = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },

  green: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
  },

  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
  },

  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },

  red: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  href,
  color = "blue",
}: StatCardProps) {
  const c = colors[color];

  const changeStyles = {
    positive: {
      text: "text-emerald-600",
      icon: ArrowUpRight,
    },
    negative: {
      text: "text-red-600",
      icon: ArrowDownRight,
    },
    neutral: {
      text: "text-slate-500",
      icon: null,
    },
  };

  const trend = changeStyles[changeType];
  const TrendIcon = trend.icon;

  const content = (
    <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">

        <div className="flex-1">

          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          {change && (
            <div className={`mt-4 flex items-center gap-1 text-sm font-medium ${trend.text}`}>
              {TrendIcon && <TrendIcon className="h-4 w-4" />}
              <span>{change}</span>
            </div>
          )}
        </div>

        <div
          className={`rounded-2xl p-4 shadow-sm ${c.bg}`}
        >
          <Icon className={`h-7 w-7 ${c.text}`} />
        </div>

      </div>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}