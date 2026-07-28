"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon, FileText } from "lucide-react";

import { uploadFile } from "@/lib/storage/uploadFile";

interface FileUploaderProps {
  bucket: string;
  folder: string;
  accept?: string;
  multiple?: boolean;
  onUploaded?: (files: UploadedFile[]) => void;
}

export interface UploadedFile {
  name: string;
  path: string;
  url: string;
}

export default function FileUploader({
  bucket,
  folder,
  accept = "image/*,.pdf",
  multiple = true,
  onUploaded,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  function openPicker() {
    inputRef.current?.click();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setSelectedFiles(files);
  }

  async function startUpload() {
    if (!selectedFiles.length) return;

    setUploading(true);

    try {
      const uploaded: UploadedFile[] = [];

      for (const file of selectedFiles) {
        const result = await uploadFile({
          bucket,
          folder,
          file,
        });

        uploaded.push({
          name: file.name,
          path: result.path,
          url: result.publicUrl,
        });
      }

      setSelectedFiles([]);
      onUploaded?.(uploaded);
    } finally {
      setUploading(false);
    }
  }

  function removeFile(index: number) {
    setSelectedFiles((files) =>
      files.filter((_, i) => i !== index)
    );
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        hidden
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={onChange}
      />

      <button
        type="button"
        onClick={openPicker}
        className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 transition hover:border-blue-500 hover:bg-slate-50"
      >
        <Upload className="mb-3 h-8 w-8 text-blue-600" />

        <p className="font-semibold">
          Tap or click to upload
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Photos, PDFs and documents
        </p>
      </button>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className="flex items-center gap-3">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                ) : (
                  <FileText className="h-5 w-5 text-slate-500" />
                )}

                <div>
                  <p className="font-medium">{file.name}</p>

                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
              >
                <X className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ))}

          <button
            type="button"
            disabled={uploading}
            onClick={startUpload}
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Files"
            )}
          </button>
        </div>
      )}
    </div>
  );
}