"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { uploadOne, uploadMany, MediaUploadError } from "@/shared/api/media-upload";
import { formatImageUrl } from "@/shared/api/media";

/**
 * Single-image field: value is a URL string.
 */
export function ImageField({ value, onChange, folder = "misc", disabled }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => {
    setPreviewFailed(false);
  }, [value]);

  const onDrop = useCallback(
    async (accepted) => {
      const file = accepted[0];
      if (!file) return;
      setUploading(true);
      setError("");
      setPreviewFailed(false);
      try {
        const url = await uploadOne(file, folder);
        onChange(url);
      } catch (uploadError) {
        setError(
          uploadError instanceof MediaUploadError
            ? uploadError.message
            : "Tải ảnh lên thất bại.",
        );
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: disabled || uploading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-6 text-center text-sm transition ${
          isDragActive ? "border-zinc-950 bg-zinc-50" : "border-zinc-300"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        {value && previewFailed ? (
          <span className="text-xs font-semibold text-rose-600">
            Ảnh đã tải lên nhưng không hiển thị được — kiểm tra lại đường dẫn ảnh hoặc cấu hình CORS.
          </span>
        ) : value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={formatImageUrl(value)}
            alt=""
            className="max-h-32 object-contain"
            onError={() => setPreviewFailed(true)}
          />
        ) : uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" aria-hidden="true" />
        ) : (
          <>
            <ImageIcon className="h-6 w-6 text-zinc-400" aria-hidden="true" />
            <span className="text-zinc-500">Kéo thả hoặc bấm để chọn ảnh</span>
          </>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Bỏ ảnh
        </button>
      )}
      {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}

/**
 * Multi-image field: value is an array of URL strings (no ordering UI —
 * pair with SortableImageGallery when reorder/priority is needed).
 */
export default function ImageUploader({ value = [], onChange, folder = "misc", disabled }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (accepted) => {
      if (!accepted.length) return;
      setUploading(true);
      setError("");
      try {
        const urls = await uploadMany(accepted, folder);
        onChange([...(value || []), ...urls]);
      } catch (uploadError) {
        setError(
          uploadError instanceof MediaUploadError
            ? uploadError.message
            : "Tải ảnh lên thất bại.",
        );
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, value],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    disabled: disabled || uploading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-6 text-center text-sm transition ${
          isDragActive ? "border-zinc-950 bg-zinc-50" : "border-zinc-300"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" aria-hidden="true" />
        ) : (
          <>
            <UploadCloud className="h-6 w-6 text-zinc-400" aria-hidden="true" />
            <span className="text-zinc-500">Kéo thả nhiều ảnh hoặc bấm để chọn</span>
          </>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
