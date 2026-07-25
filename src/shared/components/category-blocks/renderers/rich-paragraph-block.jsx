import { sanitizeInlineHtml } from "@/shared/components/rich-text/sanitize-html";

// Class parity with the original hardcoded category-seo-content.jsx.
const VARIANT_CLASSES = {
  lead: "font-montserrat text-[15px] lg:text-[20px] font-[300] lg:font-[400] italic text-black leading-[24px] lg:leading-[28px] break-words mb-6 lg:mb-8 [&_strong]:font-[600] [&_strong]:lg:font-semibold [&_strong]:font-montserrat",
  body: "font-montserrat text-[16px] lg:text-[20px] font-[300] lg:font-[400] text-black leading-[24px] lg:leading-[28px] text-justify lg:text-left break-words mb-5 lg:mb-6 [&_strong]:font-[600] [&_strong]:lg:font-semibold [&_strong]:font-montserrat",
};

export default function RichParagraphBlock({ block }) {
  if (!block.html) return null;

  const className = VARIANT_CLASSES[block.variant] || VARIANT_CLASSES.body;

  // Re-sanitize at render time (defense-in-depth) — never trust stored data.
  return <p className={className} dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(block.html) }} />;
}
