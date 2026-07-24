"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadMany, MediaUploadError } from "@/shared/api/mediaUpload";
import { formatImageUrl } from "@/shared/api/media";

function SortableImage({ image, onRemove, onSetThumb, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.url,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="group relative aspect-square border border-zinc-200 bg-zinc-50"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={formatImageUrl(image.url)} alt="" className="h-full w-full object-cover" />
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        className="absolute left-1 top-1 flex h-7 w-7 cursor-grab items-center justify-center bg-white/90 text-zinc-600 disabled:cursor-not-allowed"
        aria-label="Kéo để sắp xếp"
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>
      {onSetThumb && (
        <button
          type="button"
          onClick={() => onSetThumb(image)}
          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center bg-white/90 text-amber-500 hover:text-amber-600"
          aria-label="Đặt làm ảnh đại diện"
        >
          <Star className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        onClick={() => onRemove(image)}
        className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center bg-white/90 text-rose-600 hover:text-rose-700"
        aria-label="Xóa ảnh"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="absolute bottom-1 left-1 bg-zinc-950/70 px-1.5 text-[10px] font-semibold text-white">
        #{image.priority}
      </span>
    </div>
  );
}

/**
 * Presentational gallery: `images` = [{url, priority}] (ordered).
 * Reorder/remove/upload are emitted as callbacks; the caller decides how to
 * persist (array-splice for create-mode, PATCH/DELETE for edit-mode).
 */
export default function SortableImageGallery({
  images = [],
  onReorder,
  onUpload,
  onRemove,
  onSetThumb,
  folder = "products",
  disabled,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDrop = useCallback(
    async (accepted) => {
      if (!accepted.length) return;
      setUploading(true);
      setError("");
      try {
        if (onUpload) {
          await onUpload(accepted);
        } else {
          await uploadMany(accepted, folder);
        }
      } catch (uploadError) {
        setError(
          uploadError instanceof MediaUploadError ? uploadError.message : "Tải ảnh lên thất bại.",
        );
      } finally {
        setUploading(false);
      }
    },
    [folder, onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    disabled: disabled || uploading,
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((image) => image.url === active.id);
    const newIndex = images.findIndex((image) => image.url === over.id);
    onReorder(arrayMove(images, oldIndex, newIndex).map((image, index) => ({ ...image, priority: index })));
  };

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((image) => image.url)} strategy={rectSortingStrategy}>
          <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {images.map((image) => (
              <SortableImage
                key={image.url}
                image={image}
                onRemove={onRemove}
                onSetThumb={onSetThumb}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div
        {...getRootProps()}
        className={`flex min-h-[6rem] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-4 py-5 text-center text-sm transition ${
          isDragActive ? "border-zinc-950 bg-zinc-50" : "border-zinc-300"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" aria-hidden="true" />
        ) : (
          <>
            <UploadCloud className="h-5 w-5 text-zinc-400" aria-hidden="true" />
            <span className="text-zinc-500">Kéo thả hoặc bấm để thêm ảnh gallery</span>
          </>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
