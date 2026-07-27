import { ReactNode } from "react";

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export default function Section({
  title,
  children,
}: SectionProps) {
  return (
    <section className="mb-8">
      {title && (
        <h2 className="mb-4 text-xl font-semibold">
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}