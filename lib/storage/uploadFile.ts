import { createClient } from "@/lib/supabase/client";

interface UploadFileOptions {
  bucket: string;
  folder: string;
  file: File;
}

export async function uploadFile({
  bucket,
  folder,
  file,
}: UploadFileOptions) {
  const supabase = createClient();

  const extension = file.name.split(".").pop();

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  const path = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return {
    ...data,
    path,
    publicUrl,
    fileName,
  };
}