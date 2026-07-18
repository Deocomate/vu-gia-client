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
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-2 border border-zinc-200 bg-white px-3 py-2"
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
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/**
 * Generic drag-reorder list for `sortOrder`/`priority` fields.
 * `items` = [{id, label}]; `onReorder` receives the reordered array.
 */
export default function SortableList({ items, onReorder, renderItem }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {renderItem ? renderItem(item) : item.label}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
