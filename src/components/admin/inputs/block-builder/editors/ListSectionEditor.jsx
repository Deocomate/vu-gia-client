import { Trash2 } from "lucide-react";

const inputClass =
  "h-9 w-full border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";
const textareaClass =
  "min-h-[60px] w-full border border-zinc-300 bg-white px-2 py-1.5 text-sm leading-6 text-zinc-900 outline-none transition focus:border-zinc-950";

export default function ListSectionEditor({ block, onUpdate }) {
  const items = block.items || [];

  const updateItem = (index, next) => {
    onUpdate({ ...block, items: items.map((item, i) => (i === index ? next : item)) });
  };

  const removeItem = (index) => {
    onUpdate({ ...block, items: items.filter((_, i) => i !== index) });
  };

  const addItem = () => {
    onUpdate({ ...block, items: [...items, { label: "", text: "" }] });
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={block.title || ""}
        onChange={(event) => onUpdate({ ...block, title: event.target.value })}
        placeholder="Tiêu đề danh sách (tùy chọn)..."
        className={inputClass}
      />

      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-2 border border-zinc-200 p-2">
          <input
            type="text"
            value={item.label || ""}
            onChange={(event) => updateItem(index, { ...item, label: event.target.value })}
            placeholder="Nhãn mục (tùy chọn)..."
            className={inputClass}
          />
          <textarea
            value={item.text || ""}
            onChange={(event) => updateItem(index, { ...item, text: event.target.value })}
            placeholder="Nội dung mục..."
            className={textareaClass}
            rows={2}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="inline-flex items-center gap-1 self-start text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Xóa mục
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="self-start border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
      >
        + Thêm mục
      </button>
    </div>
  );
}
