import { useMemo } from "react";
import { parseBlockDoc } from "@/shared/components/blocks/schema";
import { CATEGORY_BLOCK_TYPES } from "@/shared/components/category-blocks/schema";
import RichParagraphBlock from "@/shared/components/category-blocks/renderers/rich-paragraph-block";
import HeadingBlock from "@/shared/components/category-blocks/renderers/heading-block";
import ImageBlock from "@/shared/components/category-blocks/renderers/image-block";

const RENDERERS = {
  [CATEGORY_BLOCK_TYPES.RICH_PARAGRAPH]: RichParagraphBlock,
  [CATEGORY_BLOCK_TYPES.HEADING]: HeadingBlock,
  [CATEGORY_BLOCK_TYPES.IMAGE]: ImageBlock,
};

export default function CategoryBlockRenderer({ value, className }) {
  const { blocks } = useMemo(() => parseBlockDoc(value), [value]);
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block) => {
        const Renderer = RENDERERS[block.type];
        return Renderer ? <Renderer key={block.id} block={block} /> : null;
      })}
    </div>
  );
}
