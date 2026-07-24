"use client";

import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadOne, MediaUploadError } from "@/shared/api/mediaUpload";
import { formatImageUrl } from "@/shared/api/media";

const inputClass =
  "h-10 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";

export default function ImageEditor({ block, onUpdate, folder = "content" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = async (accepted) => {
    const file = accepted[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadOne(file, folder);
      onUpdate({ ...block, url });
    } catch (uploadError) {
      setError(uploadError instanceof MediaUploadError ? uploadError.message : "Tải ảnh lên thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: uploading,
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-4 text-center text-sm transition ${
          isDragActive ? "border-zinc-950 bg-zinc-50" : "border-zinc-300"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" aria-hidden="true" />
        ) : block.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={formatImageUrl(block.url)} alt="" className="max-h-32 object-contain" />
        ) : (
          <>
            <UploadCloud className="h-5 w-5 text-zinc-400" aria-hidden="true" />
            <span className="text-zinc-500">Kéo thả hoặc bấm để chọn ảnh</span>
          </>
        )}
      </div>
      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
      <input
        type="text"
        value={block.caption || ""}
        onChange={(event) => onUpdate({ ...block, caption: event.target.value })}
        placeholder="Chú thích ảnh (tùy chọn)..."
        className={inputClass}
      />
    </div>
  );
}
