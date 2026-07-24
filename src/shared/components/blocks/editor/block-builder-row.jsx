"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import { BLOCK_TYPE_LABELS, BLOCK_TYPES } from "@/shared/components/blocks/schema";
import ParagraphEditor from "@/shared/components/blocks/editor/editors/ParagraphEditor";
import HeadingEditor from "@/shared/components/blocks/editor/editors/HeadingEditor";
import ImageEditor from "@/shared/components/blocks/editor/editors/ImageEditor";
import ImageGridEditor from "@/shared/components/blocks/editor/editors/ImageGridEditor";
import QuoteEditor from "@/shared/components/blocks/editor/editors/QuoteEditor";
import ListSectionEditor from "@/shared/components/blocks/editor/editors/ListSectionEditor";
import DividerEditor from "@/shared/components/blocks/editor/editors/DividerEditor";

const EDITORS = {
  [BLOCK_TYPES.PARAGRAPH]: ParagraphEditor,
  [BLOCK_TYPES.HEADING]: HeadingEditor,
  [BLOCK_TYPES.IMAGE]: ImageEditor,
  [BLOCK_TYPES.IMAGE_GRID]: ImageGridEditor,
  [BLOCK_TYPES.QUOTE]: QuoteEditor,
  [BLOCK_TYPES.LIST_SECTION]: ListSectionEditor,
  [BLOCK_TYPES.DIVIDER]: DividerEditor,
};

export default function BlockBuilderRow({ block, onUpdate, onDuplicate, onRemove, folder }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const Editor = EDITORS[block.type];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex gap-2 border border-zinc-200 bg-white p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center text-zinc-400 hover:text-zinc-700"
        aria-label="Kéo để sắp xếp"
      >
        <GripVertical className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {BLOCK_TYPE_LABELS[block.type] || block.type}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDuplicate(block.id)}
              className="flex h-7 w-7 items-center justify-center text-zinc-400 hover:text-zinc-700"
              aria-label="Nhân bản khối"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(block.id)}
              className="flex h-7 w-7 items-center justify-center text-rose-500 hover:text-rose-700"
              aria-label="Xóa khối"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {Editor ? (
          <Editor block={block} onUpdate={onUpdate} folder={folder} />
        ) : (
          <p className="text-xs text-rose-600">Loại khối không xác định: {block.type}</p>
        )}
      </div>
    </div>
  );
}
