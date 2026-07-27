interface FormSectionProps {
  title: string;
  description?: string;

  children: React.ReactNode;

  className?: string;
}

export default function FormSection({
  title,
  description,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="border-b border-slate-200 px-8 py-6">

        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        {description && (

          <p className="mt-2 text-sm text-slate-500">
            {description}
          </p>

        )}

      </div>

      <div className="p-8">

        {children}

      </div>

    </section>
  );
}