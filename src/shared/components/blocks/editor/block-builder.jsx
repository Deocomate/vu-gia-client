"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { AlertTriangle } from "lucide-react";
import {
  parseBlockDoc,
  createEmptyBlock,
  BLOCK_TYPE_LIST,
  BLOCK_TYPE_LABELS,
} from "@/shared/components/blocks/schema";
import AddBlockMenu from "@/shared/components/blocks/editor/add-block-menu";
import BlockBuilderRow, { DEFAULT_EDITORS } from "@/shared/components/blocks/editor/block-builder-row";

const DEFAULT_REGISTRY = {
  blockTypeList: BLOCK_TYPE_LIST,
  blockTypeLabels: BLOCK_TYPE_LABELS,
  createEmptyBlock,
  editors: DEFAULT_EDITORS,
};

/**
 * Controlled block-content field. Holds `{ blocks }` internally; emits a
 * JSON **string** to `onChange` on every mutation (RT-F1: backend stores a
 * string, never a parsed object). `registry` swaps the block-type set
 * (list/labels/factory/editors) for a different domain — defaults to the
 * product/news registry so existing callers are unaffected.
 */
export default function BlockBuilder({ value, onChange, folder = "content", registry = DEFAULT_REGISTRY }) {
  const [blocks, setBlocks] = useState([]);
  const [malformed, setMalformed] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    const parsed = parseBlockDoc(value);
    setMalformed(Boolean(parsed.malformed));
    setBlocks(parsed.blocks || []);
    // Parse the initial/incoming stored value once per field mount; internal
    // edits after that are the source of truth until the parent swaps `value`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commit = (nextBlocks) => {
    setBlocks(nextBlocks);
    onChange(JSON.stringify({ blocks: nextBlocks }));
  };

  const handleAdd = (type) => {
    commit([...blocks, registry.createEmptyBlock(type)]);
  };

  const handleUpdate = (id, nextBlock) => {
    commit(blocks.map((block) => (block.id === id ? nextBlock : block)));
  };

  const handleDuplicate = (id) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index === -1) return;
    const duplicate = { ...blocks[index], id: registry.createEmptyBlock(blocks[index].type).id };
    commit([...blocks.slice(0, index + 1), duplicate, ...blocks.slice(index + 1)]);
  };

  const handleRemove = (id) => {
    commit(blocks.filter((block) => block.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((block) => block.id === active.id);
    const newIndex = blocks.findIndex((block) => block.id === over.id);
    commit(arrayMove(blocks, oldIndex, newIndex));
  };

  return (
    <div>
      {malformed && (
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          Nội dung lưu trữ không hợp lệ — đã mở tài liệu trống.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <BlockBuilderRow
                key={block.id}
                block={block}
                onUpdate={(next) => handleUpdate(block.id, next)}
                onDuplicate={handleDuplicate}
                onRemove={handleRemove}
                folder={folder}
                registry={registry}
              />
            ))}
          </SortableContext>
        </DndContext>

        {blocks.length === 0 && (
          <p className="border border-dashed border-zinc-300 px-3 py-6 text-center text-sm text-zinc-400">
            Chưa có nội dung. Bấm &quot;Thêm khối&quot; để bắt đầu.
          </p>
        )}
      </div>

      <div className="mt-3">
        <AddBlockMenu onAdd={handleAdd} registry={registry} />
      </div>
    </div>
  );
}
