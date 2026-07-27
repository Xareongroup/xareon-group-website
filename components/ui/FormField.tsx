import * as React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

export default function FormField({
  label,
  required = false,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>

        {required && (
          <span className="text-red-500">*</span>
        )}
      </div>

      {children}

      {hint && !error && (
        <p className="text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}