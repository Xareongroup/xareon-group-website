import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;

  title: string;

  description?: string;

  buttonText?: string;

  buttonHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  buttonText,
  buttonHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">

      {icon && (
        <div className="mb-6 text-5xl">
          {icon}
        </div>
      )}

      <h3 className="text-2xl font-semibold text-slate-900">
        {title}
      </h3>

      {description && (
        <p className="mt-3 max-w-md text-slate-500">
          {description}
        </p>
      )}

      {buttonText && buttonHref && (

        <Link
          href={buttonHref}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + {buttonText}
        </Link>

      )}

    </div>
  );
}