import Link from "next/link";
import JobPhotos from "@/components/admin/jobs/JobPhotos";

export default async function JobPhotosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mx-auto max-w-5xl space-y-6 px-6 py-8"><Link href={`/admin/jobs/${id}`} className="text-sm font-medium text-blue-600">← Back to job</Link><h1 className="text-3xl font-bold">Job Photos</h1><JobPhotos jobId={id}/></div>;
}
