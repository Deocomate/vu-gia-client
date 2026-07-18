const textareaClass =
  "min-h-[80px] w-full border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition focus:border-zinc-950";

export default function ParagraphEditor({ block, onUpdate }) {
  return (
    <textarea
      value={block.text || ""}
      onChange={(event) => onUpdate({ ...block, text: event.target.value })}
      placeholder="Nhập đoạn văn..."
      className={textareaClass}
      rows={4}
    />
  );
}
