const textareaClass =
  "min-h-[70px] w-full border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition focus:border-zinc-950";

export default function QuoteEditor({ block, onUpdate }) {
  return (
    <textarea
      value={block.text || ""}
      onChange={(event) => onUpdate({ ...block, text: event.target.value })}
      placeholder="Nhập nội dung trích dẫn..."
      className={textareaClass}
      rows={3}
    />
  );
}
