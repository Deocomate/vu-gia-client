const inputClass =
  "h-10 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";

export default function HeadingEditor({ block, onUpdate }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={block.text || ""}
        onChange={(event) => onUpdate({ ...block, text: event.target.value })}
        placeholder="Nhập tiêu đề..."
        className={`${inputClass} flex-1`}
      />
      <select
        value={block.level || 2}
        onChange={(event) => onUpdate({ ...block, level: Number(event.target.value) })}
        className={`${inputClass} sm:w-32`}
      >
        <option value={2}>Cấp 2 (H2)</option>
        <option value={3}>Cấp 3 (H3)</option>
      </select>
    </div>
  );
}
