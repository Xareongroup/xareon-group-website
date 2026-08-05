import Link from "next/link";
import { notFound } from "next/navigation";

const settingsSections = {
  company: ["Company Information", "Manage business identity, address, contact details, and branding."],
  documents: ["Documents", "Manage document numbering and document preferences."],
  taxes: ["Taxes & Payments", "Manage tax rates, payment terms, and currency preferences."],
  notifications: ["Notifications", "Manage email reminders and customer notification preferences."],
  integrations: ["Integrations", "Manage connections to Google Calendar, Stripe, QuickBooks, and other services."],
} as const;

interface Props {
  params: Promise<{ section: string }>;
}

export default async function SettingsSectionPage({ params }: Props) {
  const { section } = await params;
  const content = settingsSections[section as keyof typeof settingsSections];
  if (!content) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link href="/admin/settings" className="text-sm font-medium text-blue-600 hover:text-blue-700">← Settings</Link>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{content[0]}</h1>
        <p className="mt-3 text-slate-600">{content[1]}</p>
      </div>
    </div>
  );
}
