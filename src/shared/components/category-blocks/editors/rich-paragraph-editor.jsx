import RichTextField from "@/shared/components/rich-text/rich-text-field";

const selectClass =
  "h-10 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950 sm:w-56";

// Kept in sync with renderers/rich-paragraph-block.jsx so the editor is a
// true WYSIWYG preview of the storefront output.
const VARIANT_CLASSES = {
  lead: "font-montserrat text-[15px] lg:text-[20px] font-[300] lg:font-[400] italic text-black leading-[24px] lg:leading-[28px] break-words [&_strong]:font-[600] [&_strong]:lg:font-semibold [&_strong]:font-montserrat",
  body: "font-montserrat text-[16px] lg:text-[20px] font-[300] lg:font-[400] text-black leading-[24px] lg:leading-[28px] text-justify lg:text-left break-words [&_strong]:font-[600] [&_strong]:lg:font-semibold [&_strong]:font-montserrat",
};

export default function RichParagraphEditor({ block, onUpdate }) {
  const variant = block.variant || "body";

  return (
    <div className="flex flex-col gap-2">
      <select
        value={variant}
        onChange={(event) => onUpdate({ ...block, variant: event.target.value })}
        className={selectClass}
      >
        <option value="lead">Đoạn mở đầu (in nghiêng)</option>
        <option value="body">Đoạn nội dung</option>
      </select>
      <RichTextField
        value={block.html}
        onChange={(html) => onUpdate({ ...block, html })}
        className={VARIANT_CLASSES[variant]}
        placeholder="Nhập đoạn văn..."
      />
    </div>
  );
}
