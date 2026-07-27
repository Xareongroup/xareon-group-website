import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;

  buttonText?: string;
  buttonHref?: string;

  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  buttonText,
  buttonHref,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">

      <div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-base text-slate-500">
            {description}
          </p>
        )}

      </div>

      <div className="flex items-center gap-3">

        {children}

        {buttonText && buttonHref && (

          <Link
            href={buttonHref}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            + {buttonText}
          </Link>

        )}

      </div>

    </div>
  );
}