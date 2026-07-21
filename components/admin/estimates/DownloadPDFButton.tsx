"use client";

interface DownloadPDFButtonProps {
  estimate: {
    id: string;
  };
}

export default function DownloadPDFButton({
  estimate,
}: DownloadPDFButtonProps) {
  return (
    <button
      type="button"
      onClick={() =>
        window.open(
          `/api/estimates/${estimate.id}/pdf`,
          "_blank"
        )
      }
      className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
    >
      Download PDF
    </button>
  );
}