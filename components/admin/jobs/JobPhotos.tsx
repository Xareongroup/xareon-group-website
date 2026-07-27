"use client";

interface JobPhotosProps {
  jobId: string;
}

export default function JobPhotos({
  jobId,
}: JobPhotosProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Job Photos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Before, during, and after photos for this project.
          </p>
        </div>

        <button
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Upload Photo
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <div className="flex h-56 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
          No photos yet
        </div>

      </div>
    </div>
  );
}