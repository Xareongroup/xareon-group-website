"use client";

import {
  Download,
  ExternalLink,
  ImageIcon,
  FileText,
  Trash2,
} from "lucide-react";

export interface GalleryFile {
  id?: string;
  name: string;
  url: string;
}

interface Props {
  files: GalleryFile[];
  onDelete?: (file: GalleryFile) => void;
}

export default function FileGallery({
  files,
  onDelete,
}: Props) {
  if (files.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <FileText className="mx-auto mb-3 h-10 w-10 text-slate-400" />

        <p className="font-medium text-slate-600">
          No files uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => {
        const image = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);

        return (
          <div
            key={file.url}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {image ? (
              <img
                src={file.url}
                alt={file.name}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="flex h-48 items-center justify-center bg-slate-100">
                <ImageIcon className="h-12 w-12 text-slate-400" />
              </div>
            )}

            <div className="space-y-3 p-4">
              <p
                className="truncate font-medium"
                title={file.name}
              >
                {file.name}
              </p>

              <div className="flex justify-between">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>

                <a
                  href={file.url}
                  download
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <Download className="h-5 w-5" />
                </a>

                {onDelete && (
                  <button
                    onClick={() => onDelete(file)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}