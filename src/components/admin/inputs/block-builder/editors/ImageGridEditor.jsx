"use client";

import { useState } from "react";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadOne, MediaUploadError } from "@/shared/api/mediaUpload";
import { formatImageUrl } from "@/shared/api/media";

const inputClass =
  "h-9 w-full border border-zinc-300 bg-white px-2 text-xs text-zinc-900 outline-none transition focus:border-zinc-950";

function ImageSlot({ image, index, onUpdate, onRemove, folder }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = async (accepted) => {
    const file = accepted[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadOne(file, folder);
      onUpdate(index, { ...image, url });
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
    <div className="flex flex-col gap-2 border border-zinc-200 p-2">
      <div
        {...getRootProps()}
        className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed text-center text-xs transition ${
          isDragActive ? "border-zinc-950 bg-zinc-50" : "border-zinc-300"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" aria-hidden="true" />
        ) : image.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={formatImageUrl(image.url)} alt="" className="max-h-20 object-contain" />
        ) : (
          <>
            <UploadCloud className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            <span className="text-zinc-500">Chọn ảnh</span>
          </>
        )}
      </div>
      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
      <input
        type="text"
        value={image.caption || ""}
        onChange={(event) => onUpdate(index, { ...image, caption: event.target.value })}
        placeholder="Chú thích (tùy chọn)..."
        className={inputClass}
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="inline-flex items-center gap-1 self-start text-xs font-semibold text-rose-600 hover:text-rose-700"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        Xóa ảnh
      </button>
    </div>
  );
}

export default function ImageGridEditor({ block, onUpdate, folder = "content" }) {
  const images = block.images || [];

  const updateImage = (index, next) => {
    const nextImages = images.map((image, i) => (i === index ? next : image));
    onUpdate({ ...block, images: nextImages });
  };

  const removeImage = (index) => {
    onUpdate({ ...block, images: images.filter((_, i) => i !== index) });
  };

  const addImage = () => {
    onUpdate({ ...block, images: [...images, { url: "", caption: "" }] });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {images.map((image, index) => (
          <ImageSlot
            key={index}
            image={image}
            index={index}
            onUpdate={updateImage}
            onRemove={removeImage}
            folder={folder}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addImage}
        className="self-start border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
      >
        + Thêm ảnh
      </button>
    </div>
  );
}
